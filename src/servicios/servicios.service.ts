// import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Service, Prisma, Configuration, Product, Customer } from '@prisma/client';
// import { CreateEntradaDto } from './dto/create-entrada.dto';
// import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';

import { PrismaService } from '../prisma/prisma.service';
import { buildFilters } from 'src/common/utils/build-filters';

///////////////////////////




@Injectable()
export class ServiciosService {


/////sssss

  constructor(private readonly configurationsService: ConfigurationsService,
              private prisma: PrismaService
            ) {}  
/////sssss



//////dashTra

async dashboardTra(query: any) {

  const {
    baseServiceWhere,
    productoFilter,
    estadoFilter
  } = buildFilters(query);

  // 🔥 CONTEXTO PARTE (clave para no mezclar con máquina)
  const baseWherePar = {
    ...baseServiceWhere,
    // id_parte: { not: null },
  };

  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    insterValRaw,
    maqAll,
    partesAll,
    instrumentos,
    dilValRaw,
    tarRaw,
    servicesData,
    totalUsers,
    totalCustomers
  ] = await Promise.all([


    // INST VAL
    this.prisma.service.groupBy({
      by: ['terminado'],
      where: { ...baseServiceWhere, ...estadoFilter },
      _sum: { total: true },
      _count: { id: true },
    }),
    
    
    // 🔥 MAQ GENERAL
    this.prisma.service.groupBy({
      by: ['id_maquin'],
      where: {
            ...baseWherePar,
            ...estadoFilter,
            },
      _sum: { total: true },
      _count: { id_maquin: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),


    // 🔥 PARTES GENERAL
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: {
            ...baseWherePar,
            ...estadoFilter,
            },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 INSTRUMENTOS x PARTE
    this.prisma.service.groupBy({
      by: ['id_instru'],
      where: {
            ...baseWherePar,
            ...estadoFilter,
            },
      _sum: { total: true },
      _count: { id_instru: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 DIL VAL (usar totalItem ✅)
    this.prisma.serviceItem.groupBy({
      by: ['terminado'],
      where: {
        ...productoFilter,
        // service: baseWherePar,
        service: {
            ...baseWherePar,
            ...estadoFilter,
            },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        terminado: true,
      },
    }),

    // 🔥 TAR x PRODUCTO (usar totalItem ✅)
    this.prisma.serviceItem.groupBy({
      by: ['productId'],
      where: {
        ...productoFilter,
        service: {
            ...baseWherePar,
            ...estadoFilter,
            },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: { totalItem: 'desc' },
      },
      take: 10,
    }),

    // 🔥 ORDERS
    this.prisma.service.aggregate({
      where: {
        ...baseWherePar,
        ...estadoFilter,
      },
      _count: { _all: true },
      _sum: { total: true },
    }),

    this.prisma.user.count(),
    this.prisma.customer.count(),
  ]);

  // ========================
  // MAP NOMBRES
  // ========================

  const partesIds = [
    ...partesAll.map(x => x.id_parte),
    ...maqAll.map(x => x.id_maquin),

  ];

  const instrumentosIds = instrumentos.map(x => x.id_instru);
  const productosIds = tarRaw.map(x => x.productId);

  const [
    maquinasMapRaw,
    partesMapRaw,
    instrumentosMapRaw,
    productosMapRaw] =
     await Promise.all([
      this.prisma.maquina.findMany({
      where: { id: { in: partesIds } },
      select: { id: true, name: true },
    }),

    this.prisma.parte.findMany({
      where: { id: { in: partesIds } },
      select: { id: true, name: true },
    }),
    this.prisma.instrumento.findMany({
      where: { id: { in: instrumentosIds } },
      select: { id: true, name: true },
    }),
    this.prisma.product.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, title: true },
    }),
  ]);

  const mapMaquinas = Object.fromEntries(maquinasMapRaw.map(x => [x.id, x.name]));
  const mapPartes = Object.fromEntries(partesMapRaw.map(x => [x.id, x.name]));
  const mapInstrumentos = Object.fromEntries(instrumentosMapRaw.map(x => [x.id, x.name]));
  const mapProductos = Object.fromEntries(productosMapRaw.map(x => [x.id, x.title]));

  // ========================
  // TRANSFORMS
  // ========================


  const insterVal = insterValRaw.map(r => ({
    _id: r.terminado ? 'terminado' : 'pendiente',
    total: r._sum.total || 0,
    count: r._count.id,
  }));

  const mapGroup = (data: any[], map: any, key: string) =>
    data.map(x => ({
      id: x[key],
      name: map[x[key]] || '',
      total: x._sum.total || 0,
      count: x._count[key] || 0,
    }));

  const top10MaquinasxOrd = mapGroup(maqAll, mapMaquinas, 'id_maquin');
  const top10PartesxOrd = mapGroup(partesAll, mapPartes, 'id_parte');

  const TarxPar = tarRaw.map(x => ({
    productId: x.productId,
    producto: mapProductos[x.productId] || '',
    total: x._sum.totalItem || 0, // ✅ FIX
    totalCan: x._count.productId,
  }));

  const dilVal = dilValRaw.map(r => ({
    _id: r.terminado === true ? 'terminado' : 'pendiente', // ✅ FIX null-safe
    total: r._sum.totalItem || 0, // ✅ FIX
    totalCan: r._count.terminado,
  }));

  const orders = [{
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  return {
    insterVal,
    top10MaquinasxOrd,
    top10PartesxOrd,
    TarxPar,
    dilVal,
    orders,
    users: [{ numUsers: totalUsers }],
    customers: [{ numCustomers: totalCustomers }],
  };



}
//////dashTra
//////dashTar

async dashboardTar(query: any) {

  const {
    baseServiceWhere,
    productoFilter,
    estadoFilter,
    estadoServiceItemFilter
  } = buildFilters(query);

  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    maqRaw,
    parRaw,
    dilValRaw,
    servicesData,
    totalUsers,
    totalCustomers
  ] = await Promise.all([

    // 🔥 TAR x MAQUINA
    this.prisma.serviceItem.groupBy({
      by: ['serviceId'],
      where: {
        ...productoFilter,
        service: {
          ...baseServiceWhere,
          ...estadoFilter,
          // id_maquin: { not: null },
        },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        serviceId: true,
      },
    }),

    // 🔥 TAR x PARTE
    this.prisma.serviceItem.groupBy({
      by: ['serviceId'],
      where: {
        ...productoFilter,
        service: {
          ...baseServiceWhere,
          ...estadoFilter,
          // id_parte: { not: null },
        },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        serviceId: true,
      },
    }),

    // 🔥 DIL VAL
    this.prisma.serviceItem.groupBy({
      by: ['terminado'],
      where: {
        ...productoFilter,
        ...estadoServiceItemFilter,
        service: {
          ...baseServiceWhere,
        },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        terminado: true,
      },
    }),

    // 🔥 ORDERS
    this.prisma.service.aggregate({
      where: {
        ...baseServiceWhere,
      },
      _count: { _all: true },
      _sum: { total: true },
    }),

    this.prisma.user.count(),
    this.prisma.customer.count(),
  ]);

  // ========================
  // 🔥 MAP SERVICE → MAQ / PARTE
  // ========================

  const serviceIds = [
    ...maqRaw.map(x => x.serviceId),
    ...parRaw.map(x => x.serviceId),
  ].filter(Boolean);

  const services = await this.prisma.service.findMany({
    where: { id: { in: serviceIds } },
    select: {
      id: true,
      id_maquin: true,
      id_parte: true,
    },
  });

  const mapService = Object.fromEntries(
    services.map(s => [s.id, s])
  );

  // ========================
  // 🔥 AGRUPADOR
  // ========================

  const groupByKey = (
    data: any[],
    keyGetter: (s: any) => string | null,
    mapName: Record<string, string>
  ) => {

    const acc: Record<string, any> = {};

    for (const item of data) {
      const service = mapService[item.serviceId];
      const key = keyGetter(service);

      if (!key) continue;

      if (!acc[key]) {
        acc[key] = { id: key, total: 0, totalCan: 0 };
      }

      acc[key].total += item._sum.totalItem ?? 0;
      acc[key].totalCan += item._count.serviceId;
    }

    return Object.values(acc)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 10)
      .map((x: any) => ({
        ...x,
        name: mapName[x.id] || '',
      }));
  };

  // ========================
  // 🔥 TRAER NOMBRES
  // ========================

  const [maquinas, partes] = await Promise.all([
    this.prisma.maquina.findMany({ select: { id: true, name: true } }),
    this.prisma.parte.findMany({ select: { id: true, name: true } }),
  ]);

  const mapMaquinas = Object.fromEntries(maquinas.map(x => [x.id, x.name]));
  const mapPartes = Object.fromEntries(partes.map(x => [x.id, x.name]));

  // ========================
  // RESULTADOS
  // ========================

  const MaqxTar = groupByKey(
    maqRaw,
    (s) => s?.id_maquin,
    mapMaquinas
  ).map(x => ({
    maquinaId: x.id,
    maquina: x.name,
    total: x.total,
    totalCan: x.totalCan,
  }));

  const TarxPar = groupByKey(
    parRaw,
    (s) => s?.id_parte,
    mapPartes
  ).map(x => ({
    parteId: x.id,
    parte: x.name,
    total: x.total,
    totalCan: x.totalCan,
  }));

  const dilVal = dilValRaw.map(r => ({
    _id: r.terminado ? 'terminado' : 'pendiente',
    total: r._sum.totalItem ?? 0,
    totalCan: r._count.terminado,
  }));

  const orders = [{
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  const users = [{ numUsers: totalUsers }];
  const customers = [{ numCustomers: totalCustomers }];

  return {
    MaqxTar,
    TarxPar,
    orders,
    users,
    customers,
    dilVal,
  };
}
//////dashTar



//////dashPar
async dashboardPar(query: any) {

  const {
    baseServiceWhere,
    productoFilter,
    estadoFilter
  } = buildFilters(query);

  // 🔥 CONTEXTO PARTE (clave para no mezclar con máquina)
  const baseWherePar = {
    ...baseServiceWhere,
    id_parte: { not: null },
  };

  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    partesST,
    partesTER,
    partesAll,
    instrumentos,
    dilValRaw,
    tarRaw,
    servicesData,
    totalUsers,
    totalCustomers
  ] = await Promise.all([

    // 🔥 PARTES SIN TERMINAR
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: {
        ...baseWherePar,
        terminado: false,
      },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 PARTES TERMINADAS
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: {
        ...baseWherePar,
        terminado: true,
      },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),


    // 🔥 PARTES GENERAL
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: {
            ...baseWherePar,
            ...estadoFilter,
            },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 INSTRUMENTOS x PARTE
    this.prisma.service.groupBy({
      by: ['id_instru'],
      where: {
            ...baseWherePar,
            ...estadoFilter,
            },
      _sum: { total: true },
      _count: { id_instru: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 DIL VAL (usar totalItem ✅)
    this.prisma.serviceItem.groupBy({
      by: ['terminado'],
      where: {
        ...productoFilter,
        // service: baseWherePar,
        service: {
            ...baseWherePar,
            ...estadoFilter,
            },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        terminado: true,
      },
    }),

    // 🔥 TAR x PRODUCTO (usar totalItem ✅)
    this.prisma.serviceItem.groupBy({
      by: ['productId'],
      where: {
        ...productoFilter,
        service: {
            ...baseWherePar,
            ...estadoFilter,
            },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: { totalItem: 'desc' },
      },
      take: 10,
    }),

    // 🔥 ORDERS
    this.prisma.service.aggregate({
      where: {
        ...baseWherePar,
        ...estadoFilter,
      },
      _count: { _all: true },
      _sum: { total: true },
    }),

    this.prisma.user.count(),
    this.prisma.customer.count(),
  ]);

  // ========================
  // MAP NOMBRES
  // ========================

  const partesIds = [
    ...partesST.map(x => x.id_parte),
    ...partesTER.map(x => x.id_parte),
    ...partesAll.map(x => x.id_parte),
  ];

  const instrumentosIds = instrumentos.map(x => x.id_instru);
  const productosIds = tarRaw.map(x => x.productId);

  const [partesMapRaw, instrumentosMapRaw, productosMapRaw] = await Promise.all([
    this.prisma.parte.findMany({
      where: { id: { in: partesIds } },
      select: { id: true, name: true },
    }),
    this.prisma.instrumento.findMany({
      where: { id: { in: instrumentosIds } },
      select: { id: true, name: true },
    }),
    this.prisma.product.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, title: true },
    }),
  ]);

  const mapPartes = Object.fromEntries(partesMapRaw.map(x => [x.id, x.name]));
  const mapInstrumentos = Object.fromEntries(instrumentosMapRaw.map(x => [x.id, x.name]));
  const mapProductos = Object.fromEntries(productosMapRaw.map(x => [x.id, x.title]));

  // ========================
  // TRANSFORMS
  // ========================

  const mapGroup = (data: any[], map: any, key: string) =>
    data.map(x => ({
      id: x[key],
      name: map[x[key]] || '',
      total: x._sum.total || 0,
      count: x._count[key] || 0,
    }));

  const top10PartesSTVal = mapGroup(partesST, mapPartes, 'id_parte');
  const top10PartesTerVal = mapGroup(partesTER, mapPartes, 'id_parte');
  const top10PartesxOrd = mapGroup(partesAll, mapPartes, 'id_parte');
  const top10InstrumentosxPar = mapGroup(instrumentos, mapInstrumentos, 'id_instru');

  const TarxPar = tarRaw.map(x => ({
    productId: x.productId,
    producto: mapProductos[x.productId] || '',
    total: x._sum.totalItem || 0, // ✅ FIX
    totalCan: x._count.productId,
  }));

  const dilVal = dilValRaw.map(r => ({
    _id: r.terminado === true ? 'terminado' : 'pendiente', // ✅ FIX null-safe
    total: r._sum.totalItem || 0, // ✅ FIX
    totalCan: r._count.terminado,
  }));

  const orders = [{
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  return {
    top10PartesSTVal,
    top10PartesTerVal,
    top10PartesxOrd,
    top10InstrumentosxPar,
    TarxPar,
    dilVal,
    orders,
    users: [{ numUsers: totalUsers }],
    customers: [{ numCustomers: totalCustomers }],
  };
}
//////dashPar

//////dashMaq
async dashboardMaq(query: any) {

  const {
    baseServiceWhere,
    productoFilter,
    estadoFilter
  } = buildFilters(query);

  // 🔥 CONTEXTO MAQUINA (CLAVE)
  const baseWhereMaq = {
    ...baseServiceWhere,
    id_maquin: { not: null },
    id_instru: { not: null },
  };
  // 🔥 CONTEXTO PARTE (clave para no mezclar con máquina)
  const baseWherePar = {
    ...baseServiceWhere,
    id_parte: { not: null },
  };

  // ========================
  // PARALLEL QUERIES
  // ========================

  const [
    maqST,
    maqTER,
    maqAll,
    instrumentos,
    partes,
    dilValRaw,
    tarRaw,
    servicesData,
    totalUsers,
    totalCustomers
  ] = await Promise.all([

    // 🔥 MAQ SIN TERMINAR
    this.prisma.service.groupBy({
      by: ['id_maquin'],
      where: {
        ...baseWhereMaq,
        terminado: false,
      },
      _sum: { total: true },
      _count: { id_maquin: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 MAQ TERMINADAS
    this.prisma.service.groupBy({
      by: ['id_maquin'],
      where: {
        ...baseWhereMaq,
        terminado: true,
      },
      _sum: { total: true },
      _count: { id_maquin: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 MAQ GENERAL
    this.prisma.service.groupBy({
      by: ['id_maquin'],
      where: {
            ...baseWherePar,
            ...estadoFilter,
            },
      _sum: { total: true },
      _count: { id_maquin: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 INSTRUMENTOS x MAQ
    this.prisma.service.groupBy({
      by: ['id_instru'],
      where: {
            ...baseWherePar,
            ...estadoFilter,
            },
      _sum: { total: true },
      _count: { id_instru: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 PARTES x MAQ
    this.prisma.service.groupBy({
      by: ['id_parte'],
      where: {
        ...baseWhereMaq,
        id_parte: { not: null },
      },
      _sum: { total: true },
      _count: { id_parte: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    }),

    // 🔥 DIL VAL (usar totalItem ✅)
    this.prisma.serviceItem.groupBy({
      by: ['terminado'],
      where: {
        ...productoFilter,
        // service: baseWhereMaq,
        service: {
            ...baseWherePar,
            ...estadoFilter,
            },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        terminado: true,
      },
    }),

    // 🔥 TAR x PRODUCTO (usar totalItem ✅)
    this.prisma.serviceItem.groupBy({
      by: ['productId'],
      where: {
        ...productoFilter,
        // service: baseWhereMaq,
        service: {
            ...baseWherePar,
            ...estadoFilter,
            },
      },
      _sum: {
        totalItem: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: { totalItem: 'desc' },
      },
      take: 10,
    }),

    // 🔥 ORDERS
    this.prisma.service.aggregate({
      where: {
        ...baseWherePar,
        ...estadoFilter,
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

  const maqIds = [
    ...maqST.map(x => x.id_maquin),
    ...maqTER.map(x => x.id_maquin),
    ...maqAll.map(x => x.id_maquin),
  ];

  const instrumentosIds = instrumentos.map(x => x.id_instru);
  const partesIds = partes.map(x => x.id_parte);
  const productosIds = tarRaw.map(x => x.productId);

  const [
    maquinasMapRaw,
    instrumentosMapRaw,
    partesMapRaw,
    productosMapRaw
  ] = await Promise.all([
    this.prisma.maquina.findMany({
      where: { id: { in: maqIds } },
      select: { id: true, name: true },
    }),
    this.prisma.instrumento.findMany({
      where: { id: { in: instrumentosIds } },
      select: { id: true, name: true },
    }),
    this.prisma.parte.findMany({
      where: { id: { in: partesIds } },
      select: { id: true, name: true },
    }),
    this.prisma.product.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, title: true },
    }),
  ]);

  const mapMaquinas = Object.fromEntries(maquinasMapRaw.map(x => [x.id, x.name]));
  const mapInstrumentos = Object.fromEntries(instrumentosMapRaw.map(x => [x.id, x.name]));
  const mapPartes = Object.fromEntries(partesMapRaw.map(x => [x.id, x.name]));
  const mapProductos = Object.fromEntries(productosMapRaw.map(x => [x.id, x.title]));

  // ========================
  // 🔥 REUTILIZADOR
  // ========================

  const mapGroup = (data: any[], map: any, key: string) =>
    data.map(x => ({
      id: x[key],
      name: map[x[key]] || '',
      total: x._sum.total || 0,
      count: x._count[key] || 0,
    }));

  // ========================
  // RESULTADOS
  // ========================

  const top10MaquinasSTVal = mapGroup(maqST, mapMaquinas, 'id_maquin');
  const top10MaquinasTerVal = mapGroup(maqTER, mapMaquinas, 'id_maquin');
  const top10MaquinasxOrd = mapGroup(maqAll, mapMaquinas, 'id_maquin');

  const top10InstrumentosxMaq = mapGroup(instrumentos, mapInstrumentos, 'id_instru');
  const top10Partes = mapGroup(partes, mapPartes, 'id_parte');

  const TarxMaq = tarRaw.map(x => ({
    productId: x.productId,
    producto: mapProductos[x.productId] || '',
    total: x._sum.totalItem || 0, // ✅ FIX
    totalCan: x._count.productId,
  }));

  const dilVal = dilValRaw.map(r => ({
    _id: r.terminado === true ? 'terminado' : 'pendiente', // ✅ FIX
    total: r._sum.totalItem || 0, // ✅ FIX
    totalCan: r._count.terminado,
  }));

  const orders = [{
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  }];

  return {
    top10MaquinasSTVal,
    top10MaquinasTerVal,
    top10MaquinasxOrd,
    top10InstrumentosxMaq,
    top10Partes,
    TarxMaq,
    dilVal,
    orders,
    users: [{ numUsers: totalUsers }],
    customers: [{ numCustomers: totalCustomers }],
  };
}

//////dashMaq


}
