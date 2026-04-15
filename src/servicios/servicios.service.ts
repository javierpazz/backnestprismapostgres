// import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Service, Prisma, Configuration, Product, Customer } from '@prisma/client';
// import { CreateEntradaDto } from './dto/create-entrada.dto';
// import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';

import { PrismaService } from '../prisma/prisma.service';

///////////////////////////

import { Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';



@Injectable()
export class ServiciosService {


/////sssss

  constructor(private readonly configurationsService: ConfigurationsService,
              private prisma: PrismaService
            ) {}  
/////sssss



//////dashTar

async dashboardTar(query: any) {

  const {
    fech1, fech2, configuracion, usuario,
    customer, producto, parte, maquina,
    encargado, instru,
  } = query;

  // ========================
  // FILTERS
  // ========================

  const fechasFilter =
    !fech1 && !fech2
      ? {}
      : !fech1
      ? { remDat: { lte: new Date(fech2) } }
      : !fech2
      ? { remDat: { gte: new Date(fech1) } }
      : { remDat: { gte: new Date(fech1), lte: new Date(fech2) } };

  const baseWhere: any = {
    id_instru: { not: null },
    ...fechasFilter,
    ...(configuracion !== 'all' && { id_config: configuracion }),
    ...(customer !== 'all' && { id_client: customer }),
    ...(usuario !== 'all' && { user: usuario }),
    ...(instru !== 'all' && { id_instru: instru }),
    ...(parte !== 'all' && { id_parte: parte }),
    ...(maquina !== 'all' && { id_maquin: maquina }),
    ...(encargado !== 'all' && { id_encar: encargado }),
    ...(producto !== 'all' && {
      serviceItems: {
        some: { productId: producto },
      },
    }),
  };

  const itemWhere: any = {
    ...(producto !== 'all' && { productId: producto }),
    service: baseWhere,
  };

  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    maqGrouped,
    parGrouped,
    dilGrouped,
    servicesData,
    totalUsers,
    totalCustomers,
  ] = await Promise.all([

    // 🔥 MAQUINAS
    this.prisma.serviceItem.groupBy({
      by: ['serviceId'], // necesario para relación
      where: {
        ...itemWhere,
        service: { ...baseWhere, id_maquin: { not: null } },
      },
      _sum: {
        price: true,
        quantity: true,
      },
      _count: { serviceId: true },
    }),

    // 🔥 PARTES
    this.prisma.serviceItem.groupBy({
      by: ['serviceId'],
      where: {
        ...itemWhere,
        service: { ...baseWhere, id_parte: { not: null } },
      },
      _sum: {
        price: true,
        quantity: true,
      },
      _count: { serviceId: true },
    }),

    // 🔥 TERMINADO / PENDIENTE
    this.prisma.serviceItem.groupBy({
      by: ['terminado'],
      where: itemWhere,
      _sum: {
        price: true,
        quantity: true,
      },
      _count: { terminado: true },
    }),

    // 🔥 ORDERS
    this.prisma.service.aggregate({
      where: baseWhere,
      _count: { _all: true },
      _sum: { total: true },
    }),

    this.prisma.user.count(),
    this.prisma.customer.count(),
  ]);

  // ========================
  // MAQUINAS MAP
  // ========================

  const maqIds = [...new Set(maqGrouped.map(x => x.serviceId))];

  const maquinas = await this.prisma.service.findMany({
    where: { id: { in: maqIds } },
    select: { id: true, id_maquin: true },
  });

  const maqRealIds = maquinas.map(m => m.id_maquin);

  const maqNames = await this.prisma.maquina.findMany({
    where: { id: { in: maqRealIds } },
    select: { id: true, name: true },
  });

  const mapMaq = Object.fromEntries(maqNames.map(m => [m.id, m.name]));
  const mapServiceMaq = Object.fromEntries(maquinas.map(m => [m.id, m.id_maquin]));

  const MaqxTar = maqGrouped
    .map(x => {
      const maqId = mapServiceMaq[x.serviceId];
      return {
        maquinaId: maqId,
        maquina: mapMaq[maqId] || '',
        total: (x._sum.price || 0) * (x._sum.quantity || 0),
        totalCan: x._count.serviceId,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // ========================
  // PARTES MAP
  // ========================

  const parIds = [...new Set(parGrouped.map(x => x.serviceId))];

  const partesSrv = await this.prisma.service.findMany({
    where: { id: { in: parIds } },
    select: { id: true, id_parte: true },
  });

  const parRealIds = partesSrv.map(p => p.id_parte);

  const partes = await this.prisma.parte.findMany({
    where: { id: { in: parRealIds } },
    select: { id: true, name: true },
  });

  const mapPar = Object.fromEntries(partes.map(p => [p.id, p.name]));
  const mapServicePar = Object.fromEntries(partesSrv.map(p => [p.id, p.id_parte]));

  const TarxPar = parGrouped
    .map(x => {
      const parId = mapServicePar[x.serviceId];
      return {
        parteId: parId,
        parte: mapPar[parId] || '',
        total: (x._sum.price || 0) * (x._sum.quantity || 0),
        totalCan: x._count.serviceId,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // ========================
  // DIL VAL
  // ========================

  const dilVal = dilGrouped.map(x => ({
    _id: x.terminado ? 'terminado' : 'pendiente',
    total: (x._sum.price || 0) * (x._sum.quantity || 0),
    totalCan: x._count.terminado,
  }));

  const orders = [{
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  return {
    MaqxTar,
    TarxPar,
    dilVal,
    orders,
    users: [{ numUsers: totalUsers }],
    customers: [{ numCustomers: totalCustomers }],
  };
}

//////dashTar



//////dashPar

async dashboardPar(query: any) {
  const {
    fech1,
    fech2,
    configuracion,
    usuario,
    customer,
    producto,
    parte,
    maquina,
    encargado,
    instru,
    estado,
    registro,
    obser,
  } = query;

  // 🔹 BASE WHERE (OPTIMIZADO)
  const baseWhere: Prisma.ServiceWhereInput = {
    id_instru: { not: null },
    id_parte: { not: null },

    ...(fech1 || fech2
      ? {
          remDat: {
            ...(fech1 && { gte: new Date(fech1) }),
            ...(fech2 && { lte: new Date(fech2) }),
          },
        }
      : {}),

    ...(configuracion && configuracion !== 'all' && { id_config: String(configuracion) }),
    ...(customer && customer !== 'all' && { id_client: String(customer) }),
    ...(usuario && usuario !== 'all' && { user: String(usuario) }),
    ...(instru && instru !== 'all' && { id_instru: String(instru) }),
    ...(parte && parte !== 'all' && { id_parte: String(parte) }),
    ...(maquina && maquina !== 'all' && { id_maquin: String(maquina) }),
    ...(encargado && encargado !== 'all' && { id_encar: String(encargado) }),

    ...(estado === 'EST' && { terminado: false }),
    ...(estado === 'ET' && { terminado: true }),

    ...(registro === 'REGI' && { libNum: { gt: 0 } }),
    ...(registro === 'NREGI' && {
      OR: [{ libNum: { lt: 1 } }, { libNum: null }],
    }),

    ...(producto && producto !== 'all' && {
      serviceItems: {
        some: { productId: String(producto) },
      },
    }),

    ...(obser && obser !== 'all' && {
      OR: [
        { notes: { contains: obser, mode: 'insensitive' as const } },
        {
          serviceItems: {
            some: {
              observ: { contains: obser, mode: 'insensitive' as const },
            },
          },
        },
      ],
    }),
  };

  // 🔹 TOP PARTES (pendientes + terminados en paralelo)
  const [topPendientes, topTerminados] = await Promise.all([
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: { ...baseWhere, terminado: false },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: { ...baseWhere, terminado: true },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),
  ]);

  // 🔹 MAP NOMBRES PARTES
  const partesIds = [
    ...new Set([
      ...topPendientes.map(x => x.id_parte),
      ...topTerminados.map(x => x.id_parte),
    ]),
  ];

  const partes = await this.prisma.parte.findMany({
    where: { id: { in: partesIds } },
    select: { id: true, name: true },
  });

  const mapPartes = Object.fromEntries(partes.map(p => [p.id, p.name]));

  const top10PartesSTVal = topPendientes.map(c => ({
    parteId: c.id_parte,
    parte: mapPartes[c.id_parte!] || '',
    totalSales: c._sum.total ?? 0,
    totalOrders: c._count.id_parte ?? 0,
  }));

  const top10PartesTerVal = topTerminados.map(c => ({
    parteId: c.id_parte,
    parte: mapPartes[c.id_parte!] || '',
    totalSales: c._sum.total ?? 0,
    totalOrders: c._count.id_parte ?? 0,
  }));

  // 🔹 TARxPAR (SIN MEMORY LEAK)
  const TarxParRaw = await this.prisma.serviceItem.groupBy({
    by: ['productId'],
    where: {
      ...(producto && producto !== 'all' && { productId: String(producto) }),
      service: baseWhere,
    },
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: 10,
  });

  const productos = await this.prisma.product.findMany({
    where: {
      id: { in: TarxParRaw.map(x => x.productId) },
    },
    select: { id: true, title: true },
  });

  const mapProductos = Object.fromEntries(productos.map(p => [p.id, p.title]));

  const TarxPar = TarxParRaw.map(p => ({
    productId: p.productId,
    producto: mapProductos[p.productId] || '',
    totalCan: p._count.productId,
  }));

  // 🔹 DILVAL (OPTIMIZADO)
  const dilValRaw = await this.prisma.serviceItem.groupBy({
    by: ['terminado'],
    where: {
      service: baseWhere,
    },
    _sum: { price: true },
    _count: { terminado: true },
  });

  const dilVal = dilValRaw.map(r => ({
    _id: r.terminado ? 'terminado' : 'pendiente',
    total: r._sum.price ?? 0,
    totalCan: r._count.terminado ?? 0,
  }));

  // 🔹 TOP PARTES GENERAL
  const topPartesRaw = await this.prisma.service.groupBy({
    by: ['id_parte'],
    where: baseWhere,
    _sum: { total: true },
    _count: { id_parte: true },
    orderBy: { _sum: { total: 'desc' } },
    take: 10,
  });

  const top10Partes = topPartesRaw.map(c => ({
    parteId: c.id_parte,
    parte: mapPartes[c.id_parte!] || '',
    totalSales: c._sum.total ?? 0,
  }));

  // 🔹 INSTRUMENTOS
  const topInstrumentosRaw = await this.prisma.service.groupBy({
    by: ['id_instru'],
    where: baseWhere,
    _sum: { total: true },
    _count: { id_instru: true },
    orderBy: { _sum: { total: 'desc' } },
    take: 10,
  });

  const instrumentos = await this.prisma.instrumento.findMany({
    where: {
      id: { in: topInstrumentosRaw.map(x => x.id_instru!) },
    },
    select: { id: true, name: true },
  });

  const mapInstrumentos = Object.fromEntries(
    instrumentos.map(i => [i.id, i.name])
  );

  const top10InstrumentosxPar = topInstrumentosRaw.map(c => ({
    instrumentoId: c.id_instru,
    instrumento: mapInstrumentos[c.id_instru!] || '',
    totalSales: c._sum.total ?? 0,
    totalOrders: c._count.id_instru ?? 0,
  }));

  // 🔹 ORDERS
  const servicesData = await this.prisma.service.aggregate({
    where: baseWhere,
    _count: { _all: true },
    _sum: { total: true },
  });

  const orders = [
    {
      _id: null,
      numOrders: servicesData._count._all,
      totalSales: servicesData._sum.total || 0,
    },
  ];

  return {
    top10PartesSTVal,
    top10PartesTerVal,
    top10Partes,
    top10InstrumentosxPar,
    TarxPar,
    dilVal,
    orders,
  };
}
//////dashPar

//////dashMaq

async dashboardMaq(query: any) {

  const {
    fech1,
    fech2,
    configuracion,
    usuario,
    customer,
    producto,
    parte,
    maquina,
    encargado,
    instru,
    estado,
    registro,
    obser,
  } = query;

  // ========================
  // HELPERS
  // ========================
  const calcTotal = (item: any) =>
    (item.price || 0) *
    (item.quantity || 0) *
    (1 + (item.porIva || 0) / 100);

type GroupedResult = {
  productId?: string;
  id_maquin?: string;
  id_parte?: string;
  total: number;
  totalCan: number;
};

const groupByField = (
  data: any[],
  field: 'productId' | 'id_maquin' | 'id_parte'
): GroupedResult[] => {
  return Object.values(
    data.reduce((acc, item) => {
      const key = item[field];
      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = {
          [field]: key,
          total: 0,
          totalCan: 0,
        };
      }

      acc[key].total += calcTotal(item);
      acc[key].totalCan += 1;

      return acc;
    }, {} as Record<string, GroupedResult>)
  );
};

  // ========================
  // FILTROS
  // ========================
  const fechasInvFilter =
    !fech1 && !fech2
      ? {}
      : !fech1 && fech2
      ? { remDat: { lte: new Date(fech2) } }
      : fech1 && !fech2
      ? { remDat: { gte: new Date(fech1) } }
      : { remDat: { gte: new Date(fech1), lte: new Date(fech2) } };

  const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
  const maquinaFilter = maquina && maquina !== 'all' ? { id_maquin: String(maquina) } : {};
  const encargadoFilter = encargado && encargado !== 'all' ? { id_encar: String(encargado) } : {};
  const instruFilter = instru && instru !== 'all' ? { id_instru: String(instru) } : {};
  const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
  const configuracionFilter =
    configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
  const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

  const estadoFilter =
    estado === 'EST'
      ? { terminado: false }
      : estado === 'ET'
      ? { terminado: true }
      : {};

  const registroFilter =
    registro === 'REGI'
      ? { libNum: { gt: 0 } }
      : registro === 'NREGI'
      ? { OR: [{ libNum: { lt: 1 } }, { libNum: null }] }
      : registro === 'PROT'
      ? { asiNum: { gt: 0 } }
      : registro === 'NPROT'
      ? { OR: [{ asiNum: { lt: 1 } }, { asiNum: null }] }
      : {};

  const obserFilter: Prisma.ServiceWhereInput =
    obser && obser !== 'all'
      ? {
          OR: [
            {
              notes: {
                contains: obser,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              serviceItems: {
                some: {
                  observ: {
                    contains: obser,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          ],
        }
      : {};

  const productoFilter = producto && producto !== 'all'
    ? { productId: String(producto) }
    : {};

  const productoOrderItemFilter =
    producto && producto !== 'all'
      ? {
          serviceItems: {
            some: { productId: String(producto) },
          },
        }
      : {};

  // ========================
  // BASE WHERE
  // ========================
  const baseServiceWhere: Prisma.ServiceWhereInput = {
    id_instru: { not: null },
    id_maquin: { not: null },
    ...fechasInvFilter,
    ...configuracionFilter,
    ...customerFilter,
    ...usuarioFilter,
    ...instruFilter,
    ...parteFilter,
    ...maquinaFilter,
    ...encargadoFilter,
    ...estadoFilter,
    ...registroFilter,
    ...obserFilter,
    ...productoOrderItemFilter,
  };

  // ========================
  // TOP MAQUINAS (ST / TER)
  // ========================
  const getTopMaquinas = async (terminado: boolean) => {
    const data = await this.prisma.service.groupBy({
      by: ['id_maquin'],
      where: { ...baseServiceWhere, terminado },
      _sum: { total: true },
      _count: { id_maquin: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    });

    const maquinas = await this.prisma.maquina.findMany({
      where: { id: { in: data.map(d => d.id_maquin!) } },
      select: { id: true, name: true },
    });

    const map = Object.fromEntries(maquinas.map(m => [m.id, m.name]));

    return data.map(d => ({
      maquinaId: d.id_maquin,
      maquina: map[d.id_maquin!] || '',
      totalSales: d._sum.total || 0,
      totalOrders: d._count.id_maquin || 0,
    }));
  };

  const top10MaquinasSTVal = await getTopMaquinas(false);
  const top10MaquinasTerVal = await getTopMaquinas(true);

  // ========================
  // DIL VAL
  // ========================
  const resultDil = await this.prisma.serviceItem.findMany({
    where: {
      ...productoFilter,
      service: baseServiceWhere,
    },
    select: {
      terminado: true,
      price: true,
      quantity: true,
      porIva: true,
    },
  });

  const dilGrouped = resultDil.reduce((acc, item) => {
    const key = item.terminado ? 'terminado' : 'pendiente';

    if (!acc[key]) acc[key] = { total: 0, totalCan: 0 };

    acc[key].total += calcTotal(item);
    acc[key].totalCan++;

    return acc;
  }, {} as Record<string, any>);

  const dilVal = Object.entries(dilGrouped).map(([k, v]) => ({
    _id: k,
    total: v.total,
    totalCan: v.totalCan,
  }));

  // ========================
  // TAR X MAQ (PRODUCTOS)
  // ========================
  const items = await this.prisma.serviceItem.findMany({
    where: {
      ...productoFilter,
      service: baseServiceWhere,
    },
    select: {
      productId: true,
      price: true,
      quantity: true,
      porIva: true,
    },
  });

  const groupedProducts = groupByField(items, 'productId')
    .sort((a, b) => b.total - a.total);

  const ids = [...new Set(groupedProducts.map(p => String(p.productId)))];

  const products = await this.prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true },
  });

  const mapProducts = Object.fromEntries(products.map(p => [p.id, p.title]));

  const TarxMaq = groupedProducts.map(p => ({
    productId: p.productId,
    producto: mapProducts[p.productId] || 'Sin nombre',
    total: p.total,
    totalCan: p.totalCan,
  }));

  // ========================
  // ORDERS
  // ========================
  const servicesData = await this.prisma.service.aggregate({
    where: baseServiceWhere,
    _count: { _all: true },
    _sum: { total: true },
  });

  const orders = [{
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  const users = [{
    _id: null,
    numUsers: await this.prisma.user.count(),
  }];

  const customers = [{
    _id: null,
    numCustomers: await this.prisma.customer.count(),
  }];

  // ========================
  // RETURN
  // ========================
  return {
    top10MaquinasSTVal,
    top10MaquinasTerVal,
    orders,
    users,
    customers,
    dilVal,
    TarxMaq,
  };
}
//////dashMaq


}
