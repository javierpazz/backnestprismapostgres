import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Order, Prisma, Configuration, Product, Customer } from '@prisma/client';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';

import { PrismaService } from '../prisma/prisma.service';
import { buildFilters } from 'src/common/utils/build-filters';


@Injectable()
export class EntradasService {

  constructor(private readonly configurationsService: ConfigurationsService,
              private prisma: PrismaService
            ) {}  


async searchSerUS(id: string) {

  if (!id) {
    throw new BadRequestException('Email is required');
  }

  // 🔥 1. Buscar cliente (más eficiente)
  const customer = await this.prisma.customer.findUnique({
    where: { emailCus: id },
    select: { id: true, nameCus: true, emailCus: true },
  });

  if (!customer) {
    throw new NotFoundException(`Customer with email "${id}" not found`);
  }

  // 🔥 2. Query optimizada (solo lo necesario)
  const services = await this.prisma.service.findMany({
    where: {
      id_client: customer.id,
      id_instru: { not: null },
    },
    select: {
      id: true,
      total: true,
      remNum: true,
      remDat: true,
      staOrd: true,
      terminado: true,

      customer: {
        select: {
          id: true,
          nameCus: true,
          emailCus: true,
        },
      },

      instrumento: {
        select: { id: true, name: true },
      },

      maquina: {
        select: { id: true, name: true },
      },

      parte: {
        select: { id: true, name: true },
      },

      user1: {
        select: { id: true, name: true, email: true },
      },

      serviceItems: {
        select: {
          productId: true,
          title: true,
          quantity: true,
          price: true,
          porIva: true,
          totalItem: true,
          size: true,
          observ: true,
          terminado: true,
        },
      },
    },
    orderBy: {
      remDat: 'desc', // opcional pero recomendado
    },
  });

  // 🔥 3. Transform limpio
  return services.map(order => ({
    _id: order.id,
    remNum: order.remNum,
    remDat: order.remDat,
    staOrd: order.staOrd,
    total: order.total,
    terminado: order.terminado,

    id_client: order.customer && {
      _id: order.customer.id,
      nameCus: order.customer.nameCus,
      emailCus: order.customer.emailCus,
    },

    id_instru: order.instrumento && {
      _id: order.instrumento.id,
      name: order.instrumento.name,
    },

    id_maquin: order.maquina && {
      _id: order.maquina.id,
      name: order.maquina.name,
    },

    id_parte: order.parte && {
      _id: order.parte.id,
      name: order.parte.name,
    },

    user: order.user1 && {
      _id: order.user1.id,
      name: order.user1.name,
      email: order.user1.email,
    },

    serviceItems: order.serviceItems.map(item => ({
      productId: item.productId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      porIva: item.porIva,
      totalItem: item.totalItem,
      size: item.size,
      observ: item.observ,
      terminado: item.terminado,
    })),
  }));
}


//////dash1esc
async dashboardEsc(query: any) {

  const {
    baseServiceWhere,
    productoFilter,
    estadoFilter
  } = buildFilters(query);
  // ========================
  // FILTERS
  // ========================

  // const obserFilter =
  //   obser && obser !== 'all'
  //     ? {
  //         OR: [
  //           { notes: { contains: obser, mode: 'insensitive' } },
  //           {
  //             serviceItems: {
  //               some: {
  //                 observ: { contains: obser, mode: 'insensitive' },
  //               },
  //             },
  //           },
  //         ],
  //       }
  //     : {};


  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    topUsers,
    topCustomers,
    topPartes,
    insterValRaw,
    dilValRaw,
    pubPriRaw,
    categories,
    servicesData,
    totalUsers,
    totalCustomers,
  ] = await Promise.all([

    // TOP USERS
    this.prisma.service.groupBy({
      by: ['user'],
      // where: baseServiceWhere,
      where: { ...baseServiceWhere, ...estadoFilter },
      _sum: { total: true },
      _count: { user: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // TOP CUSTOMERS
    this.prisma.service.groupBy({
      by: ['id_client'],
      where: { ...baseServiceWhere,
               ...estadoFilter,
                id_client: { not: null } },
      _sum: { total: true },
      _count: { id_client: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // TOP PARTES
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: { ...baseServiceWhere,
               ...estadoFilter,
              id_parte: { not: null }
             },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // INST VAL
    this.prisma.service.groupBy({
      by: ['terminado'],
      where: { ...baseServiceWhere, ...estadoFilter },
      _sum: { total: true },
      _count: { id: true },
    }),

    // DIL VAL (OPTIMIZADO)
    this.prisma.serviceItem.groupBy({
      by: ['terminado'],
      // where: itemWhere,
      where: {
          ...productoFilter,
        service: {...baseServiceWhere,
                  ...estadoFilter,
                },
      },
      _sum: {
        totalItem: true,
        // quantity: true,
      },
      _count: {
        terminado: true,
      },
    }),

    // PUBLIC / PRIVATE (LIGHT)
    this.prisma.service.findMany({
      where: { ...baseServiceWhere, ...estadoFilter },
      select: {
        total: true,
        instrumento: {
          select: { publico: true },
        },
      },
    }),

    // CATEGORIES
    this.prisma.product.groupBy({
      by: ['category'],
      _count: { category: true },
    }),

    // TOTAL SERVICES
    this.prisma.service.aggregate({
      where: { ...baseServiceWhere, ...estadoFilter },
      _count: { _all: true },
      _sum: { total: true },
    }),

    // COUNTS
    this.prisma.user.count(),
    this.prisma.customer.count(),
  ]);

  // ========================
  // MAPS
  // ========================

  const [usersTop, customersTop, partesTop] = await Promise.all([
    this.prisma.user.findMany({
      where: { id: { in: topUsers.map(x => x.user!) } },
      select: { id: true, name: true },
    }),
    this.prisma.customer.findMany({
      where: { id: { in: topCustomers.map(x => x.id_client!) } },
      select: { id: true, nameCus: true },
    }),
    this.prisma.parte.findMany({
      where: { id: { in: topPartes.map(x => x.id_parte!) } },
      select: { id: true, name: true },
    }),
  ]);

  const mapUsers = Object.fromEntries(usersTop.map(x => [x.id, x.name]));
  const mapCustomers = Object.fromEntries(customersTop.map(x => [x.id, x.nameCus]));
  const mapPartes = Object.fromEntries(partesTop.map(x => [x.id, x.name]));

  // ========================
  // FINAL TRANSFORMS
  // ========================

  const top10UsersSTVal = topUsers.map(x => ({
    userId: x.user,
    user: mapUsers[x.user!],
    totalSales: x._sum.total || 0,
    totalOrders: x._count.user,
  }));

  const top10Clients = topCustomers.map(x => ({
    customerId: x.id_client,
    customer: mapCustomers[x.id_client!],
    totalSales: x._sum.total || 0,
    totalOrders: x._count.id_client,
  }));

  const top10Partes = topPartes.map(x => ({
    parteId: x.id_parte,
    parte: mapPartes[x.id_parte!],
    totalSales: x._sum.total || 0,
    totalOrders: x._count.id_parte,
  }));

  const insterVal = insterValRaw.map(r => ({
    _id: r.terminado ? 'terminado' : 'pendiente',
    total: r._sum.total || 0,
    count: r._count.id,
  }));

  const dilVal = dilValRaw.map(r => ({
    _id: r.terminado ? 'terminado' : 'pendiente',
    // total: (r._sum.price || 0) * (r._sum.quantity || 0),
    total: r._sum.totalItem,
    totalCan: r._count.terminado,
  }));

  const PubPriVal = (() => {
    let pub = 0, pri = 0, cpub = 0, cpri = 0;
    for (const s of pubPriRaw) {
      if (s.instrumento?.publico) {
        pub += s.total || 0;
        cpub++;
      } else {
        pri += s.total || 0;
        cpri++;
      }
    }
    return [
      { type: 'Publico', total: pub, totalcont: cpub },
      { type: 'Privado', total: pri, totalcont: cpri },
    ];
  })();

  const productCategories = categories.map(c => ({
    _id: c.category,
    count: c._count.category,
  }));

  const orders = [{
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  return {
    productCategories,
    orders,
    users: [{ numUsers: totalUsers }],
    customers: [{ numCustomers: totalCustomers }],
    top10Clients,
    top10Partes,
    PubPriVal,
    dilVal,
    insterVal,
    top10UsersSTVal,
  };
}
//////dash1Esc






  
//////dashCli
async dashboardCli(query: any) {

  const {
    baseServiceWhere,
    productoFilter,
    estadoServiceItemFilter,
    estadoFilter
  } = buildFilters(query);

  // 🔥 CONTEXTOS
  const baseWhereMaq = {
    ...baseServiceWhere,
    id_maquin: { not: null },
  };

  const baseWherePar = {
    ...baseServiceWhere,
    id_parte: { not: null },
  };

  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    tarMaqRaw,
    tarParRaw,
    instMaq,
    instPar,
    servicesData,
    totalUsers,
    totalCustomers
  ] = await Promise.all([

    // 🔥 TAR x PRODUCTO (MAQ) ✅ totalItem
    this.prisma.serviceItem.groupBy({
      by: ['productId'],
      where: {
        ...productoFilter,
        ...estadoServiceItemFilter,
        service: baseWhereMaq,
      },
      _sum: {
        totalItem: true,
        quantity: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: { totalItem: 'desc' },
      },
      take: 10,
    }),

    // 🔥 TAR x PRODUCTO (PARTE) ✅ totalItem
    this.prisma.serviceItem.groupBy({
      by: ['productId'],
      where: {
        ...productoFilter,
        ...estadoServiceItemFilter,
        service: baseWherePar,
      },
      _sum: {
        totalItem: true,
        quantity: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: { totalItem: 'desc' },
      },
      take: 10,
    }),

    // 🔥 INSTRUMENTOS (MAQ)
    this.prisma.service.groupBy({
      by: ['id_instru'],
      // where: baseWhereMaq,
      where: {
        ...baseWhereMaq,
        ...estadoFilter,
      },
      _sum: { total: true },
      _count: { id_instru: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 INSTRUMENTOS (PARTE)
    this.prisma.service.groupBy({
      by: ['id_instru'],
      // where: baseWherePar,
      where: {
        ...baseWherePar,
        ...estadoFilter,
      },
      _sum: { total: true },
      _count: { id_instru: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 ORDERS
    this.prisma.service.aggregate({
      where: {
        ...baseServiceWhere,
        ...estadoFilter,
        // OR: [
        //   { id_maquin: { not: null } },
        //   { id_parte: { not: null } },
        // ],
      },
      _count: { _all: true },
      _sum: { total: true },
    }),

    this.prisma.user.count(),
    this.prisma.customer.count(),
  ]);

  // ========================
  // 🔥 MAP IDS → NAMES
  // ========================

  const productosIds = [
    ...tarMaqRaw.map(x => x.productId),
    ...tarParRaw.map(x => x.productId),
  ];

  const instrumentosIds = [
    ...instMaq.map(x => x.id_instru),
    ...instPar.map(x => x.id_instru),
  ];

  const [productosRaw, instrumentosRaw] = await Promise.all([
    this.prisma.product.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, title: true },
    }),
    this.prisma.instrumento.findMany({
      where: { id: { in: instrumentosIds } },
      select: { id: true, name: true },
    }),
  ]);

  const mapProductos = Object.fromEntries(productosRaw.map(x => [x.id, x.title]));
  const mapInstrumentos = Object.fromEntries(instrumentosRaw.map(x => [x.id, x.name]));

  // ========================
  // 🔥 TRANSFORMS
  // ========================

  const TarxMaq = tarMaqRaw.map(x => ({
    productId: x.productId,
    producto: mapProductos[x.productId] || '',
    total: x._sum.totalItem || 0, // ✅ FIX
    totalQuantity: x._sum.quantity || 0, // ✅ FIX
    totalCan: x._count.productId,
  }));

  const TarxPar = tarParRaw.map(x => ({
    productId: x.productId,
    producto: mapProductos[x.productId] || '',
    total: x._sum.totalItem || 0, // ✅ FIX
    totalQuantity: x._sum.quantity || 0, // ✅ FIX
    totalCan: x._count.productId,
  }));

  const mapGroup = (data: any[], map: any, key: string) =>
    data.map(x => ({
      id: x[key],
      name: map[x[key]] || '',
      total: x._sum.total || 0,
      count: x._count[key] || 0,
    }));

  const top10InstrumentosxMaq = mapGroup(instMaq, mapInstrumentos, 'id_instru');
  const top10InstrumentosxPar = mapGroup(instPar, mapInstrumentos, 'id_instru');

  const orders = [{
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  return {
    top10InstrumentosxMaq,
    top10InstrumentosxPar,
    TarxPar,
    TarxMaq,
    orders,
    users: [{ numUsers: totalUsers }],
    customers: [{ numCustomers: totalCustomers }],
  };
}
//////dashCli






async create(createEntradaDto: any) {

  // const { serviceItems, orderAddress, ...serviceData } = createEntradaDto;
  const { serviceItems, ...serviceData } = createEntradaDto;

  const safeDate = (dateStr?: string) => dateStr ? new Date(dateStr) : null;

  try {

    const result = await this.prisma.$transaction(async (tx) => {

      let remNumero = 0;

      // =========================
      // 🔢 NUMERADOR REMITO
      // =========================
      if (serviceData.remNum > 0) {
        remNumero = serviceData.remNum;
      } else {

        const config = await tx.configuration.update({
          where: { id: serviceData.codCon },
          data: {
            numIntRem: { increment: 1 },
          },
        });

        remNumero = config.numIntRem;
      }

      // =========================
      // 🧾 CREAR ORDER
      // =========================

      
      //verifico si totas las tareas estan terminadas
          // const allItemsFinished = serviceItems?.every(item => item.terminado === true);
        // const allItemsFinished =
        //   serviceItems?.length > 0 &&
        //   serviceItems.every(item => item.terminado === true);
        const allItemsFinished =
          Array.isArray(serviceItems) &&
          serviceItems.length > 0 &&
          serviceItems.every(item => item?.terminado === true);      //verifico si totas las tareas estan terminadas

        const service = await tx.service.create({
        data: {

          paymentMethod: serviceData.paymentMethod,
          subTotal: serviceData.subTotal,
          shippingPrice: serviceData.shippingPrice,
          tax: serviceData.tax,
          total: serviceData.total,
          totalBuy: serviceData.totalBuy,

          ////agrearemito
            isPaid: false,
            staOrd: "NUEVA",
      ////agrearemito
          
          itemsInOrder: serviceItems?.length || 0,

          libNum: serviceData.libNum,
          folNum: serviceData.folNum,
          asiNum: serviceData.asiNum,
          asiDat: safeDate(serviceData.asiDat),

          escNum: serviceData.escNum,
          asieNum: serviceData.asieNum,
          asieDat: safeDate(serviceData.asieDat),

          // terminado: serviceData.terminado,
          terminado: allItemsFinished ?? false,

          movpvNum: serviceData.movpvNum,
          movpvDat: safeDate(serviceData.movpvDat),

          codConNum: serviceData.codConNum,

          // 🔢 remito seguro
          remNum: remNumero,
          remDat: safeDate(serviceData.remDat),

          dueDat: safeDate(serviceData.dueDat),

          invNum: serviceData.invNum,
          invDat: safeDate(serviceData.invDat),

          recNum: serviceData.recNum,
          recDat: safeDate(serviceData.recDat),

          desVal: serviceData.desVal,
          notes: serviceData.notes,
          salbuy: serviceData.salbuy,

          // =========================
          // 🔗 RELACIONES
          // =========================
          customer: serviceData.codCus
            ? { connect: { id: serviceData.codCus } }
            : undefined,

          parte: serviceData.codPar
            ? { connect: { id: serviceData.codPar } }
            : undefined,

          maquina: serviceData.codMaq
            ? { connect: { id: serviceData.codMaq } }
            : undefined,

          encargado: serviceData.codEnc
            ? { connect: { id: serviceData.codEnc } }
            : undefined,

          instrumento: serviceData.codIns
            ? { connect: { id: serviceData.codIns } }
            : undefined,

          configuration: serviceData.codCon
            ? { connect: { id: serviceData.codCon } }
            : undefined,

          user1: serviceData.user
            ? { connect: { id: serviceData.user } }
            : undefined,

          // =========================
          // 📦 ITEMS
          // =========================
          serviceItems: {
            create: serviceItems.map(item => ({
              slug: item.slug,
              title: item.title,
              medPro: item.medPro,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              size: item.size,
              porIva: item.porIva,
              totalItem: item.totalItem,
              venDat: safeDate(item.venDat),
              observ: item.observ,
              terminado: item.terminado,
              productId: item._id,
            }))
          }

        },
        include: { serviceItems: true },
      });

      return service;
    });

    return { invoice: result };

  } catch (error) {
    this.handleExceptions(error);
  }
}

async findAll(query: any) {

  const { order } = query;

  // 🔥 filtros centralizados
  const { baseServiceWhere, estadoFilter, sortOrder } = buildFilters(query);


  // ========================
  // QUERY
  // ========================

  const services = await this.prisma.service.findMany({
    where: {
      ...baseServiceWhere,
      ...estadoFilter
    },
    orderBy: sortOrder,

    include: {
      customer: true,
      configuration: true,
      instrumento: true,
      parte: true,
      maquina: true,
      encargado: true,
      user1: true,
      serviceItems: true,
    },
  });

  // ========================
  // TRANSFORM
  // ========================

  const entradas = services.map(service => ({
    _id: service.id,
    ...service,

    id_client: service.customer
      ? {
          _id: service.customer.id,
          nameCus: service.customer.nameCus,
        }
      : null,

    id_config: service.configuration
      ? {
          _id: service.configuration.id,
          name: service.configuration.name,
        }
      : null,

    id_instru: service.instrumento
      ? {
          _id: service.instrumento.id,
          name: service.instrumento.name,
          publico: service.instrumento.publico,
        }
      : null,

    id_parte: service.parte
      ? {
          _id: service.parte.id,
          name: service.parte.name,
        }
      : null,

    id_maquin: service.maquina
      ? {
          _id: service.maquina.id,
          name: service.maquina.name,
        }
      : null,

    id_encar: service.encargado
      ? {
          _id: service.encargado.id,
          name: service.encargado.name,
        }
      : null,

    user: service.user1
      ? {
          _id: service.user1.id,
          name: service.user1.name,
        }
      : null,

    serviceItems: service.serviceItems.map(item => ({
      _id: item.productId,
      slug: item.slug,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      porIva: item.porIva,
      totalItem: item.totalItem,
      size: item.size,
      observ: item.observ,
      terminado: item.terminado,
      productId: item.productId,
    })),
  }));

  return { entradas };
}

//////dili
async findAlldil(query: any) {


  // 🔥 filtros centralizados
  const {
    baseServiceWhere, sortServiceItemOrder, estadoServiceItemFilter
    // productoFilter,      // 👈 para serviceItem
    // estadoFilterItem,    // 👈 nuevo (terminado en item)
    // obserServiceItemFilter,     // 👈 nuevo (observ en item)
  } = buildFilters(query);

  // ========================
  // ORDEN
  // ========================


  // ========================
  // QUERY
  // ========================

  const serviceItemsWithOrder = await this.prisma.serviceItem.findMany({
    where: {
      // ...productoFilter,
      // ...estadoFilterItem,
      ...estadoServiceItemFilter,
      
      service: {
        is: {
          ...baseServiceWhere,
        },
      },
    },
    
    orderBy: sortServiceItemOrder,

    include: {
      service: {
        include: {
          customer: true,
          parte: true,
          maquina: true,
          encargado: true,
          instrumento: true,
          configuration: true,
          user1: true,
        },
      },
      product: true,
    },
  });

  // ========================
  // TRANSFORM
  // ========================

  const entradas = serviceItemsWithOrder.map(item => {
    const s = item.service;

    return {
      _id: s?.id,

      serviceItems: {
        _id: item.id,
        slug: item.slug,
        title: item.title,
        medPro: item.medPro,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size,
        porIva: item.porIva,
        totalItem: item.totalItem,
        venDat: item.venDat,
        observ: item.observ,
        terminado: item.terminado,
      },

      paymentMethod: s?.paymentMethod ?? '',
      subTotal: s?.subTotal ?? 0,
      shippingPrice: s?.shippingPrice ?? 0,
      tax: s?.tax ?? 0,
      total: s?.total ?? 0,
      totalBuy: s?.totalBuy ?? 0,

      id_client: s?.customer ?? { nameCus: '' },
      id_instru: s?.instrumento ?? { name: '' },
      id_parte: s?.parte ?? { name: '' },
      id_maquin: s?.maquina ?? { name: '' },
      id_encar: s?.encargado ?? { name: '' },

      terminado: s?.terminado ?? false,
      id_config: s?.configuration ?? { name: '' },

      codConNum: s?.codConNum ?? '',
      user: s?.user1 ?? { name: '' },

      isPaid: s?.isPaid ?? false,
      isDelivered: s?.isDelivered ?? false,

      remNum: s?.remNum ?? 0,
      remDat: s?.remDat ?? null,
      dueDat: s?.dueDat ?? null,

      invNum: s?.invNum ?? 0,
      invDat: s?.invDat ?? null,

      recNum: s?.recNum ?? 0,
      recDat: s?.recDat ?? null,

      desVal: s?.desVal ?? '',
      notes: s?.notes ?? '',
      salbuy: s?.salbuy ?? '',

      createdAt: s?.createdAt ?? new Date(),
      updatedAt: s?.updatedAt ?? new Date(),

      // 🔥 aliases
      instruName: s?.instrumento?.name ?? '',
      instruPublico: s?.instrumento?.publico ?? '',
      parteName: s?.parte?.name ?? '',
      maquinaName: s?.maquina?.name ?? '',
      encargadoName: s?.encargado?.name ?? '',
      customName: s?.customer?.nameCus ?? '',
      configName: s?.configuration?.name ?? '',
      userName: s?.user1?.name ?? '',

      // 🔥 cálculos
      valor: (item.price * (1 + item.porIva / 100)).toFixed(2),
      totalOrder: (s?.total ?? 0).toFixed(2),

      __v: 0,
    };
  });

  return { entradas };
}
//////dili



////OneService
async findOneSer(id: string) {
  if (!id) throw new NotFoundException(`Entrada with id "${id}" not found`);

  const invoice = await this.prisma.service.findUnique({
    where: { id },
    include: {
      customer: true,       // id_client
      comprobante: true,      
      supplier1: true,      
      configuration: true,  // id_config
      configuration2: true,  // id_config
      instrumento: true,    // id_instru
      parte: true,          // id_parte
      maquina: true,          // id_parte
      encargado: true,          // id_parte
      user1: true,          // usuario
      // serviceItems: true,
    serviceItems: {
      include: {
        product: {
          include: {
            ProductImage: true, // all image fields
          },
        },
      },
    },
      // orderAddress: true,
    },
  });

  if (!invoice) throw new NotFoundException(`Entrada with id "${id}" not found`);

  // Mapear el resultado al formato deseado
  const formattedInvoice = {
    _id: invoice.id,
    ...invoice,
    id_client: invoice.customer
      ? { _id: invoice.customer.id,
        codCus: invoice.customer.codCus,
        nameCus: invoice.customer.nameCus,
        cuit: invoice.customer.cuit,
        coniva: invoice.customer.coniva,
        domcomer: invoice.customer.domcomer}
      : null,
      codCom: invoice.comprobante
      ? { _id: invoice.comprobante.id,
        codCom: invoice.comprobante.codComC,
        nameCom: invoice.comprobante.nameCom,
        noDisc: invoice.comprobante.noDisc,
        toDisc: invoice.comprobante.toDisc,
        itDisc: invoice.comprobante.itDisc}
        : null,
    supplier: invoice.supplier1
          ? { _id: invoice.supplier1.id,
            codSup: invoice.supplier1.codSup,
            name: invoice.supplier1.name,
            cuit: invoice.supplier1.cuit,
            coniva: invoice.supplier1.coniva,
            domcomer: invoice.supplier1.domcomer}
          : null,
    id_config: invoice.configuration
      ? { _id: invoice.configuration.id,
         codCon: invoice.configuration.codCon,
         name: invoice.configuration.name }
         : null,
    id_config2: invoice.configuration2
      ? { _id: invoice.configuration2.id,
         codCon: invoice.configuration2.codCon,
         name: invoice.configuration2.name,
         cuit: invoice.configuration2.cuit,
         coniva: invoice.configuration2.coniva,
         domcomer: invoice.configuration2.domcomer}
         : null,
    id_instru: invoice.instrumento
      ? { _id: invoice.instrumento.id,
      codIns: invoice.instrumento.codIns,
      publico: invoice.instrumento.publico,
      name: invoice.instrumento.name }
      : null,
    id_parte: invoice.parte
      ? { _id: invoice.parte.id,
      codPar: invoice.parte.codPar,
      name: invoice.parte.name }
      : null,
    id_maquin: invoice.maquina
      ? { _id: invoice.maquina.id,
      codMaq: invoice.maquina.codMaq,
      name: invoice.maquina.name }
      : null,
    id_encar: invoice.encargado
      ? { _id: invoice.encargado.id,
      codEnc: invoice.encargado.codEnc,
      name: invoice.encargado.name }
      : null,
    user: invoice.user1
      ? { _id: invoice.user1.id,
      name: invoice.user1.name }
    : null,

    // orderAddress: invoice.ordYes==="Y"

    // ?  {
    //       firstName: invoice.serviceAddress[0].firstName,
    //       lastName: invoice.serviceAddress[0].lastName,
    //       address: invoice.serviceAddress[0].address,
    //       address2: invoice.serviceAddress[0].address2,
    //       city: invoice.serviceAddress[0].city,
    //       zip: invoice.serviceAddress[0].postalCode,
    //       country: invoice.serviceAddress[0].countryId,
    //       phone: invoice.serviceAddress[0].phone,
    // }: null,

    serviceItems: invoice.serviceItems.map(item => ({
      _id: item.productId,
      slug: item.slug,
      title: item.title,
      // image: item.product.ProductImage[0].url,
      image: item.product.ProductImage[0].url.includes('http') ? item.product.ProductImage[0].url : `${ process.env.HOST_NAME}/products/${ item.product.ProductImage[0].url }`,

      medPro: item.medPro,
      quantity: item.quantity,
      price: item.price,
      porIva: item.porIva,
      totalItem: item.totalItem,
      venDat: item.venDat,
      size: item.size,
      observ: item.observ,
      terminado: item.terminado,
      productId: item.productId,
    })),
  };

  // console.log(invoice.serviceItems);

  return formattedInvoice;
}
////OneService


async update(updateEntradaDto: any, id: string) {

  const safeDate = (dateStr?: string) => dateStr ? new Date(dateStr) : null;
  try {

    const result = await this.prisma.$transaction(async (tx) => {

      // =========================
      // 🔍 VALIDAR EXISTENCIA
      // =========================
      const invoice = await tx.service.findUnique({
        where: { id },
      });

      if (!invoice) {
        throw new NotFoundException(`Entrada with id "${id}" not found`);
      }

      // =========================
      // 🧠 NORMALIZAR IDS
      // =========================
      const getId = (field: any) =>
        typeof field === 'object' ? field?._id : field;

      const id_client = getId(updateEntradaDto.codCus);
      const id_config = getId(updateEntradaDto.codCon);
      const id_instru = getId(updateEntradaDto.codIns);
      const id_parte = updateEntradaDto.codPar
        ? getId(updateEntradaDto.codPar)
        : null;
      const id_maquin = updateEntradaDto.codMaq
        ? getId(updateEntradaDto.codMaq)
        : null;
      const id_encar = updateEntradaDto.codEnc
        ? getId(updateEntradaDto.codEnc)
        : null;
      const user = getId(updateEntradaDto.user);

      // =========================
      // 🧾 UPDATE
      // =========================
      const service = await tx.service.update({
        where: { id },
        data: {

          paymentMethod: updateEntradaDto.paymentMethod,
          subTotal: updateEntradaDto.subTotal,
          shippingPrice: updateEntradaDto.shippingPrice,
          tax: updateEntradaDto.tax,
          total: updateEntradaDto.total,
          totalBuy: updateEntradaDto.totalBuy,

          libNum: updateEntradaDto.libNum,
          folNum: updateEntradaDto.folNum,

          asiNum: updateEntradaDto.asiNum,
          asiDat: safeDate(updateEntradaDto.asiDat),

          escNum: updateEntradaDto.escNum,
          asieNum: updateEntradaDto.asieNum,
          asieDat: safeDate(updateEntradaDto.asieDat),

          terminado: updateEntradaDto.terminado,

          movpvNum: updateEntradaDto.movpvNum,
          movpvDat: safeDate(updateEntradaDto.movpvDat),

          codConNum: updateEntradaDto.codConNum,

          // ❌ ELIMINADO: supplier incorrecto
          // ✅ SI EXISTE RELACIÓN:
          supplier1: updateEntradaDto.codSup
            ? { connect: { id: updateEntradaDto.codSup } }
            : undefined,

          remDat: safeDate(updateEntradaDto.remDat),
          dueDat: safeDate(updateEntradaDto.dueDat),

          invNum: updateEntradaDto.invNum,
          invDat: safeDate(updateEntradaDto.invDat),

          recNum: updateEntradaDto.recNum,
          recDat: safeDate(updateEntradaDto.recDat),

          desVal: updateEntradaDto.desVal,
          notes: updateEntradaDto.notes,
          salbuy: updateEntradaDto.salbuy,

          // =========================
          // 🔗 RELACIONES CORRECTAS
          // =========================
          customer: id_client
            ? { connect: { id: id_client } }
            : undefined,

          // parte: id_parte
          //   ? { connect: { id: id_parte } }
          //   : undefined,
          parte:
            id_parte === null
              ? { disconnect: true }
              : id_parte
              ? { connect: { id: id_parte } }
              : undefined,

          // maquina: id_maquin
          //   ? { connect: { id: id_maquin } }
          //   : undefined,
          maquina:
            id_maquin === null
              ? { disconnect: true }
              : id_maquin
              ? { connect: { id: id_maquin } }
              : undefined,

          // encargado: id_encar
          //   ? { connect: { id: id_encar } }
          //   : undefined,
          encargado:
            id_encar === null
              ? { disconnect: true }
              : id_encar
              ? { connect: { id: id_encar } }
              : undefined,


          instrumento: id_instru
            ? { connect: { id: id_instru } }
            : undefined,

          configuration: id_config
            ? { connect: { id: id_config } }
            : undefined,

          user1: user
            ? { connect: { id: user } }
            : undefined,

          // =========================
          // 📦 ITEMS
          // =========================
          serviceItems: {
            deleteMany: { serviceId: id },
            create: updateEntradaDto.serviceItems?.map((oi) => ({
              title: oi.title,
              medPro: oi.medPro,
              quantity: oi.quantity,
              price: oi.price,
              porIva: oi.porIva,
              totalItem: oi.totalItem,
              venDat: safeDate(oi.venDat),
              observ: oi.observ,
              slug: oi.slug,
              size: oi.size,
              terminado: oi.terminado,
              productId: oi._id,
            })) || [],
          },

          itemsInOrder: updateEntradaDto.serviceItems?.length || 0,

        },
        include: { serviceItems: true },
      });

      return service;
    });

    return {
      invoice: {
        ...result,
        _id: result.id,
      }
    };

  } catch (error) {
    this.handleExceptions(error);
  }
}


async applychasta(updateInvoiceDto: any, id: any) {
  try {
      const invoice = await this.prisma.service.update({
        where: { id: id },
        data: {
          staOrd: updateInvoiceDto.staOrd,
        },
        include: { serviceItems: true },          
      });

      return invoice;

  } catch (error) {
    this.handleExceptions(error);
  }
}


async remove(id: string) {
  try {
    await this.prisma.serviceItem.deleteMany({
      where: { serviceId: id },
    });
    await this.prisma.service.delete({
      where: { id },
    });
    return { message: `Documento con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`Documento con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Documento exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Documento - Check server logs`);
  }


}
