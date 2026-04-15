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
    
    /// cambiar filtro por cliente
    // aqui hago trampa por que estoy enviando el email ya desde el front

    let customer: Customer;
    if ( id ) {
      customer = await this.prisma.customer.findFirst({
      where: { emailCus :id },
      });
    }
    if ( !customer ) 
      throw new NotFoundException(`Customer with email, name or no "${ id }" not found`);
    
    
    // --- Fechas ---
    // const usuarioFilter = id && id !== 'all' ? { user: String(id) } : {};
    const customerFilter = customer.id && customer.id !== 'all' ? { id_client: String(customer.id) } : {};
    
    



    const existeIns = {
      id_instru: {
        not: null
      }
    };
///////query

    const servicesWork = await this.prisma.service.findMany({
      where: {
        ...customerFilter,
        ...existeIns,
        // ordYes: 'Y'
      },

      include: {
        customer: true,
        instrumento: true,
        maquina: true,
        parte: true,
        user1: true,          // usuario si quieres incluirlo
        serviceItems: true,
      },      })
  const orders = servicesWork.map((order) => ({
    _id: order.id,
    ...order,
    id_client: order.customer
      ? { _id: order.customer.id, nameCus: order.customer.nameCus, emailCus: order.customer.emailCus }
      : null,
    id_instru: order.instrumento
      ? { _id: order.instrumento.id, name: order.instrumento.name }
      : null,
    id_maquin: order.maquina
      ? { _id: order.maquina.id, name: order.maquina.name }
      : null,
    id_parte: order.parte
      ? { _id: order.parte.id, name: order.parte.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name, email: order.user1.email }
      : null,

    serviceItems: order.serviceItems.map((item) => ({
      _id: item.productId,
      slug: item.slug,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      porIva: item.porIva,
      size: item.size,
      observ: item.observ,
      terminado: item.terminado,
      productId: item.productId,
    })),
  }));

  return orders;}



//////dash1esc
async dashboardEsc(query: any) {

  const {
    baseServiceWhere,
    productoFilter
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
      where: baseServiceWhere,
      _sum: { total: true },
      _count: { user: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // TOP CUSTOMERS
    this.prisma.service.groupBy({
      by: ['id_client'],
      where: { ...baseServiceWhere, id_client: { not: null } },
      _sum: { total: true },
      _count: { id_client: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // TOP PARTES
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: { ...baseServiceWhere, id_parte: { not: null } },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // INST VAL
    this.prisma.service.groupBy({
      by: ['terminado'],
      where: baseServiceWhere,
      _sum: { total: true },
      _count: { id: true },
    }),

    // DIL VAL (OPTIMIZADO)
    this.prisma.serviceItem.groupBy({
      by: ['terminado'],
      // where: itemWhere,
      where: {
          ...productoFilter,
        service: baseServiceWhere,
      },
      _sum: {
        price: true,
        quantity: true,
      },
      _count: {
        terminado: true,
      },
    }),

    // PUBLIC / PRIVATE (LIGHT)
    this.prisma.service.findMany({
      where: baseServiceWhere,
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
      where: baseServiceWhere,
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
    total: (r._sum.price || 0) * (r._sum.quantity || 0),
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
    estadoServiceItemFilter,
  } = buildFilters(query);

  // ========================
  // FILTERS
  // ========================


  // const itemWhere: any = {
  //   ...(producto !== 'all' && { productId: producto }),
  //   service: baseWhere,
  // };

  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    tarGrouped,
    tarGroupedPar,
    topInstMaq,
    topInstPar,
    servicesData,
    totalUsers,
    totalCustomers,
  ] = await Promise.all([

    // 🔥 PRODUCTOS x MAQUINA
    this.prisma.serviceItem.groupBy({
      by: ['productId'],
      where: {
        ...estadoServiceItemFilter,
        service: { ...baseServiceWhere, id_maquin: { not: null }},
      },
      _sum: {
        price: true,
        quantity: true,
      },
      _count: {
        productId: true,
      },
    }),

    // 🔥 PRODUCTOS x PARTE
    this.prisma.serviceItem.groupBy({
      by: ['productId'],
      where: {
        ...estadoServiceItemFilter,
        service: { ...baseServiceWhere, id_parte: { not: null } },
      },
      _sum: {
        price: true,
        quantity: true,
      },
      _count: {
        productId: true,
      },
    }),

    // 🔥 INSTRUMENTOS x MAQ
    this.prisma.service.groupBy({
      by: ['id_instru'],
      where: { ...baseServiceWhere, id_maquin: { not: null } },
      _sum: { total: true },
      _count: { id_instru: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 INSTRUMENTOS x PAR
    this.prisma.service.groupBy({
      by: ['id_instru'],
      where: { ...baseServiceWhere, id_parte: { not: null } },
      _sum: { total: true },
      _count: { id_instru: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 ORDERS
    this.prisma.service.aggregate({
      where: {
        ...baseServiceWhere,
        OR: [{ id_maquin: { not: null } }, { id_parte: { not: null } }],
      },
      _count: { _all: true },
      _sum: { total: true },
    }),

    this.prisma.user.count(),
    this.prisma.customer.count(),
  ]);

  // ========================
  // PRODUCTS MAP
  // ========================

  const allProductIds = [
    ...new Set([
      ...tarGrouped.map(x => x.productId),
      ...tarGroupedPar.map(x => x.productId),
    ]),
  ];

  const productos = await this.prisma.product.findMany({
    where: { id: { in: allProductIds } },
    select: { id: true, title: true },
  });

  const mapProductos = Object.fromEntries(
    productos.map(p => [p.id, p.title])
  );

  // ========================
  // TRANSFORMS
  // ========================

  const TarxMaq = tarGrouped
    .map(x => ({
      productId: x.productId,
      producto: mapProductos[x.productId] || 'Sin nombre',
      total: (x._sum.price || 0) * (x._sum.quantity || 0),
      totalCan: x._count.productId,
    }))
    .sort((a, b) => b.total - a.total);

  const TarxPar = tarGroupedPar
    .map(x => ({
      productId: x.productId,
      producto: mapProductos[x.productId] || 'Sin nombre',
      total: (x._sum.price || 0) * (x._sum.quantity || 0),
      totalCan: x._count.productId,
    }))
    .sort((a, b) => b.total - a.total);

  const mapInst = async (data: any[]) => {
    const ids = data.map(x => x.id_instru);
    const inst = await this.prisma.instrumento.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    const map = Object.fromEntries(inst.map(i => [i.id, i.name]));
    return data.map(x => ({
      instrumentoId: x.id_instru,
      instrumento: map[x.id_instru] || 'Sin nombre',
      totalSales: x._sum.total || 0,
      totalOrders: x._count.id_instru,
    }));
  };

  const [top10InstrumentosxMaq, top10InstrumentosxPar] =
    await Promise.all([
      mapInst(topInstMaq),
      mapInst(topInstPar),
    ]);

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
}//////dashCli






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
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  instru,
  parte,
  maquina,
  encargado,
  producto,
  estado,
  registro,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { remDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { remDat: { gte: new Date(fech1) } }
        : { remDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const maquinaFilter = maquina && maquina !== 'all' ? { id_maquin: String(maquina) } : {};
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encar: String(encargado) } : {};
    const instruFilter = instru && instru !== 'all' ? { id_instru: String(instru) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    const productoFilter =
      producto && producto !== 'all'
        ? {
            serviceItems: {
              some: {
                productId: String(producto),
              },
            },
          }
        : {};

    
const obserFilter: Prisma.ServiceWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            serviceItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};

    // --- Estado ---
    const estadoFilter =
      estado === 'TOD'
        ? {}
        : estado === 'EST'
        ? { terminado: false }
        : estado === 'ET'
        ? { terminado: true }
        : {};

    const existeIns =
          { "id_instru": { not : null} };

          // --- Registro ---
  const registroFilter =
    registro === 'TOD'
      ? {}
      : registro === 'REGI'
      ? { libNum: { gt: 0 } }
      : registro === 'NREGI'
      ? {
          OR: [
            { libNum: { lt: 1 } },
            { libNum: null }
          ]
        }
      : registro === 'PROT'
      ? { asiNum: { gt: 0 } }
      : registro === 'NPROT'
      ?{
        OR: [
          { asiNum: { lt: 1 } },
          { asiNum: null }
        ]
      }
      : {};


    // --- Orden ---
    // const sortOrder = service === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const sortOrder = order === 'newest'
      ? { remDat: 'desc' as const }
      : { remDat: 'asc' as const };


///////query

    const services = await this.prisma.service.findMany({
      where: {
        ...fechasFilter,
        ...parteFilter,
        ...maquinaFilter,
        ...encargadoFilter,
        ...instruFilter,
        ...customerFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...estadoFilter,
        ...registroFilter,
        ...existeIns,
        // filtro en serviceItem
        ...productoFilter,
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        configuration: true,  // id_config
        instrumento: true,    // id_instru
        parte: true,          // id_parte si aplica
        maquina: true,          // id_parte si aplica
        encargado: true,          // id_parte si aplica
        user1: true,          // usuario si quieres incluirlo
        serviceItems: true,
      },      })

  const entradas = services.map((service) => ({
    _id: service.id,
    ...service,
    id_client: service.customer
      ? { _id: service.customer.id, nameCus: service.customer.nameCus }
      : null,
    id_config: service.configuration
      ? { _id: service.configuration.id, name: service.configuration.name }
      : null,
    id_instru: service.instrumento
      ? { _id: service.instrumento.id, name: service.instrumento.name,
              publico: service.instrumento.publico,
       }
      : null,
    id_parte: service.parte
      ? { _id: service.parte.id, name: service.parte.name }
      : null,
    id_maquin: service.maquina
      ? { _id: service.maquina.id, name: service.maquina.name }
      : null,
    id_encar: service.encargado
      ? { _id: service.encargado.id, name: service.encargado.name }
      : null,
    user: service.user
      ? { _id: service.user1.id, name: service.user1.name }
      : null,

    serviceItems: service.serviceItems.map((item) => ({
      _id: item.productId,
      slug: item.slug,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      porIva: item.porIva,
      size: item.size,
      observ: item.observ,
      terminado: item.terminado,
      productId: item.productId,

    })),
  }));

  return { entradas };}
//////dili


  async findAlldil(query: any) {
  const {
    order,
    fech1,
    fech2,
    configuracion,
    usuario,
    customer,
    instru,
    parte,
    maquina,
    encargado,
    producto,
    estado,
    registro,
    obser,
  } = query;
  // --- Fechas ---
  const fechasFilter =
    !fech1 && !fech2
      ? {}
      : !fech1 && fech2
      ? { remDat: { lte: new Date(fech2) } }
      : fech1 && !fech2
      ? { remDat: { gte: new Date(fech1) } }
      : { remDat: { gte: new Date(fech1), lte: new Date(fech2) } };

  // --- Filtros por relaciones (dentro de order)
  const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
  const maquinaFilter = maquina && maquina !== 'all' ? { id_maquin: String(maquina) } : {};
  const encargadoFilter = encargado && encargado !== 'all' ? { id_encar: String(encargado) } : {};
  const instruFilter = instru && instru !== 'all' ? { id_instru: String(instru) } : {};
  const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
  const configuracionFilter =
    configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
  const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

  // --- Filtro por producto (en el mismo ServiceItem)
  const productFilter =
    producto && producto !== 'all' ? { productId: String(producto) } : {};

  // --- Filtro por observaciones ---
  const obserFilter: Prisma.ServiceItemWhereInput =
    obser && obser !== 'all'
      ? {
          OR: [
            { observ: { contains: obser, mode: 'insensitive' } },
            {
              service: {
                notes: { contains: obser, mode: 'insensitive' },
              },
            },
          ],
        }
      : {};

  // --- Estado ---
  const estadoFilter =
    estado === 'TOD'
      ? {}
      : estado === 'EST'
      ? { terminado: false }
      : estado === 'ET'
      ? { terminado: true } 
      : {};
  // const estadoFilter =
  //   estado === 'TOD'
  //     ? {}
  //     : estado === 'EST'
  //     ? { order: {terminado: false } }
  //     : estado === 'ET'
  //     ? { order: {terminado: true } }
  //     : {};
  // --- Registro ---
  const registroFilter =
    registro === 'TOD'
      ? {}
      : registro === 'REGI'
      ? { libNum: { gt: 0 } }
      : registro === 'NREGI'
      ? {
          OR: [
            { libNum: { lt: 1 } },
            { libNum: null }
          ]
        }
      : registro === 'PROT'
      ? { asiNum: { gt: 0 } }
      : registro === 'NPROT'
      ?{
        OR: [
          { asiNum: { lt: 1 } },
          { asiNum: null }
        ]
      }
      : {};

  // --- Instrumentos existentes ---
  const existeIns = { id_instru: { not: null } };
    // const existeIns = { 
    //   orderId: { not: null },  // aseguro que tenga orden
    //   order: { id_instru: { not: null } },
    // };

  // --- Ordenamiento ---
  const sortOrder =
    order === 'newest'
      ? { service: { remDat: 'desc' as const } }
      : { service: { remDat: 'asc' as const } };

  // --- Query final ---
  const serviceItemsWithOrder = await this.prisma.serviceItem.findMany({

    where: {
      ...productFilter,
      ...obserFilter,
      ...estadoFilter,
      service: {
        is: {
          // id_instru: { not: null }, // ✅ el filtro se mantiene
          ...registroFilter,
          ...existeIns,
          ...fechasFilter,
          ...parteFilter,
          ...maquinaFilter,
          ...encargadoFilter,
          ...instruFilter,
          ...customerFilter,
          ...configuracionFilter,
          ...usuarioFilter,
        },
      },
    },

    orderBy: sortOrder,
    include: {
      service: {
        include: {
          // orderAddress: true,
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
// Traemos todos los ServiceItems con sus Order relacionados

// Mapeamos cada ServiceItem a un objeto tipo invoice
const entradas = serviceItemsWithOrder.map(item => ({
  // _id: item.id, // ID del item
_id: item.service?.id,
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
    venDat: item.venDat,
    observ: item.observ,
    terminado: item.terminado,
  },
  // orderAddress: item.service?.serviceAddress?.[0] ?? {
  //   firstName: '',
  //   lastName: '',
  //   address: '',
  //   address2: '',
  //   city: '',
  //   zip: '',
  //   country: '',
  //   phone: ''
  // },
  paymentMethod: item.service?.paymentMethod ?? '',
  subTotal: item.service?.subTotal ?? 0,
  shippingPrice: item.service?.shippingPrice ?? 0,
  tax: item.service?.tax ?? 0,
  total: item.service?.total ?? 0,
  totalBuy: item.service?.totalBuy ?? 0,
  // id_client: item.service?.id_client ? item.service.id_client : null,
  id_client: item.service?.customer ?? { nameCus: '' },
  // id_instru: item.service?.id_instru ? item.service.id_instru : null,
  id_instru: item.service?.instrumento ?? { name: '' },
  id_parte: item.service?.parte ?? { name: '' },
  id_maquin: item.service?.maquina ?? { name: '' },
  id_encar: item.service?.encargado ?? { name: '' },


  // libNum: item.service?.libNum ?? 0,
  // folNum: item.service?.folNum ?? 0,
  // asiNum: item.service?.asiNum ?? 0,
  // asiDat: item.service?.asiDat ?? null,
  // escNum: item.service?.escNum ?? 0,
  // asieNum: item.service?.asieNum ?? 0,
  // asieDat: item.service?.asieDat ?? null,
  terminado: item.service?.terminado ?? false,
  // id_config: item.service?.id_config ? item.service.id_config : null,
  id_config: item.service?.configuration ?? { name: '' },
  codConNum: item.service?.codConNum ?? '',
  // user: item.service?.user ? item.service.user : null,
  user: item.service?.user1 ?? { name: '' },
  isPaid: item.service?.isPaid ?? false,
  isDelivered: item.service?.isDelivered ?? false,
  remNum: item.service?.remNum ?? 0,
  remDat: item.service?.remDat ?? null,
  dueDat: item.service?.dueDat ?? null,
  invNum: item.service?.invNum ?? 0,
  invDat: item.service?.invDat ?? null,
  recNum: item.service?.recNum ?? 0,
  recDat: item.service?.recDat ?? null,
  desVal: item.service?.desVal ?? '',
  notes: item.service?.notes ?? '',
  salbuy: item.service?.salbuy ?? '',
  createdAt: item.service?.createdAt ?? new Date(),
  updatedAt: item.service?.updatedAt ?? new Date(),

  // Campos calculados / alias de relaciones
  instruName: item.service?.instrumento?.name ?? '',
  instruPublico: item.service?.instrumento?.publico ?? '',
  parteName: item.service?.parte?.name ?? '',
  maquinaName: item.service?.maquina?.name ?? '',
  encargadoName: item.service?.encargado?.name ?? '',
  customName: item.service?.customer?.nameCus ?? '',
  configName: item.service?.configuration?.name ?? '',
  userName: item.service?.user1?.name ?? '',
  valor: (item.price * (1 + item.porIva / 100)).toFixed(2),
  totalOrder: item.service?.total?.toFixed(2) ?? '0.00',
  __v: 0,
}));


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
      image: item.product.ProductImage[0].url.includes('http') ? item.product.ProductImage[0].url : `${ process.env.HOST_NAME}/PRODUCTS/${ item.product.ProductImage[0].url }`,

      medPro: item.medPro,
      quantity: item.quantity,
      price: item.price,
      porIva: item.porIva,
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

          parte: id_parte
            ? { connect: { id: id_parte } }
            : undefined,
          maquina: id_maquin
            ? { connect: { id: id_maquin } }
            : undefined,
          encargado: id_encar
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
