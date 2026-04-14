import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Order, Prisma, Configuration, Product, Customer } from '@prisma/client';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';

import { PrismaService } from '../prisma/prisma.service';


@Injectable()
// export class EntradasService extends PrismaClient implements OnModuleInit {

//   constructor(private readonly configurationsService: ConfigurationsService) {
//     super();
//   }
//   async onModuleInit() {
//     await this.$connect();
//   }
export class EntradasService {

  constructor(private readonly configurationsService: ConfigurationsService,
              private prisma: PrismaService
            ) {}  

// @Injectable()
// export class EntradasService {
//   constructor(
//     private readonly configurationsService: ConfigurationsService,
//   ) {}




// async create(createEntradaDto: any) {
//   const { serviceItems, orderAddress, ...serviceData } = createEntradaDto;

//   const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
//     try {


// //////////////
//       let remNumero;
//       if (serviceData.remNum > 0) {
//         remNumero = serviceData.remNum;
//       } else {
//         const configId = serviceData.codCon;
//         // const configuracion = await Configuration.findById(configId).session(session);
//         const configuracion = await this.prisma.configuration.findUnique(
//           {
//             where: { id: configId },
//           }
//         );
//         if (configuracion) {
//           configuracion.numIntRem += 1;
//           // await configuracion.save({ session });
//           await this.prisma.configuration.update(
//             {
//               where: { id: configId },
//               data: {
//                 numIntRem: { increment: 1 },
//               },
//             }
//           );
//           remNumero = configuracion.numIntRem;
//         } else {
//           throw new Error('Configuración no encontrada');
//         }
//       }
//       serviceData.remNum = remNumero;    
// //////////////




//             const invoice = await this.prisma.service.create({
//           data: {
//             paymentMethod: serviceData.paymentMethod,
//             subTotal: serviceData.subTotal,
//             shippingPrice: serviceData.shippingPrice,
//             tax: serviceData.tax,
//             total: serviceData.total,
//             totalBuy: serviceData.totalBuy,
//             itemsInOrder:0,
//             libNum: serviceData.libNum,
//             folNum: serviceData.folNum,
//             asiNum: serviceData.asiNum,
//             asiDat: safeDate(serviceData.asiDat),
//             escNum: serviceData.escNum,
//             asieNum: serviceData.asieNum,
//             asieDat: safeDate(serviceData.asieDat),
//             terminado: serviceData.terminado,
//             movpvNum: serviceData.movpvNum,
//             movpvDat: safeDate(serviceData.movpvDat),
//             codConNum: serviceData.codConNum,
//             // codCom: serviceData.codCom,
//             // supplier: serviceData.supplier,
//             remNum: serviceData.remNum,
//             // remNum: 1234,
//             remDat: safeDate(serviceData.remDat),
//             dueDat: safeDate(serviceData.dueDat),
//             invNum: serviceData.invNum,
//             invDat: safeDate(serviceData.invDat),
//             recNum: serviceData.recNum,
//             recDat: safeDate(serviceData.recDat),
//             desVal: serviceData.desVal,
//             notes: serviceData.notes,
//             salbuy: serviceData.salbuy,

//             // relaciones
//             customer: serviceData.codCus ? { connect: { id: serviceData.codCus } } : undefined,
//             parte: serviceData.codPar ? { connect: { id: serviceData.codPar } } : undefined,
//             instrumento: serviceData.codIns ? { connect: { id: serviceData.codIns } } : undefined,
//             configuration: serviceData.codCon ? { connect: { id: serviceData.codCon } } : undefined,
//             user1: serviceData.user ? { connect: { id: serviceData.user } } : undefined,


            
//             // service items
//             serviceItems: {
//               create: serviceItems.map(item => ({
//                 slug: item.slug,
//                 title: item.title,
//                 medPro: item.medPro,
//                 quantity: item.quantity,
//                 image: item.image,
//                 price: item.price,
//                 size: item.size,
//                 porIva: item.porIva,
//                 venDat: safeDate(item.venDat),
//                 observ: item.observ,
//                 terminado: item.terminado,
//                 // productId: item.productId,
//                 productId: item._id,
//                 // instrumentoId: item.instrumentoId,



//               }))
//             }
//           },
//           include: { serviceItems: true }, // incluye los items en la respuesta
//         });

//         return { invoice };
            
//     } catch (error) {
//       this.handleExceptions( error );
//     }

// }

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




//////dashTar

  async dashboardTar(query: any) {


///filtroparaborrar
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
} = query;

    // --- Fechas ---
    const fechasInvFilter =
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
    const instruFilter = instru && instru !== 'all' ? {id_instru: String(instru)} : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};
    const productoFilter = producto && producto !== 'all' ? { productId: String(producto) } : {};

///filtroparaborrar

///////tarxmaq
// 1. Traer datos
const result = await this.prisma.serviceItem.findMany({
  where: {
    ...productoFilter,
    service: {
      id_instru: { not: null },
      id_maquin: { not: null },
      ...fechasInvFilter,
      ...configuracionFilter,
      ...customerFilter,
      ...usuarioFilter,
      ...instruFilter,
      ...parteFilter,
    },
  },
  select: {
    price: true,
    quantity: true,
    porIva: true,
    service: {
      select: {
        id_maquin: true,
      },
    },
  },
});

// 2. Agrupar SOLO por máquina
const grouped = result.reduce((acc, item) => {
  const idMaquin = item.service?.id_maquin;
  if (!idMaquin) return acc;

  if (!acc[idMaquin]) {
    acc[idMaquin] = {
      id_maquin: idMaquin,
      total: 0,
      totalCan: 0,
    };
  }

  acc[idMaquin].total +=
    (item.price || 0) *
    (item.quantity || 0) *
    (1 + (item.porIva || 0) / 100);

  acc[idMaquin].totalCan += 1;

  return acc;
}, {} as Record<string, {
  id_maquin: string;
  total: number;
  totalCan: number;
}>);

// 3. Convertir a array
const allData = Object.values(grouped);

// 4. Ordenar y TOP 10
const top10 = allData
  .sort((a, b) => b.total - a.total) // 💰 ranking por total
  .slice(0, 10);

// 5. (OPCIONAL) traer nombre de máquina
const maquinasIds = top10.map(m => m.id_maquin);

const maquinas = await this.prisma.maquina.findMany({
  where: {
    id: { in: maquinasIds },
  },
  select: {
    id: true,
    // ajustá este campo según tu modelo
    name: true
  },
});

const mapMaquinas = Object.fromEntries(
  maquinas.map(m => [m.id, m])
);

// 6. Resultado final
const MaqxTar = top10.map(m => ({
  maquinaId: m.id_maquin,
  maquina: mapMaquinas[m.id_maquin]?.name || '',
  total: m.total,
  totalCan: m.totalCan,
}));

///////tarxmaq

///////tarxpar
// 1. Traer datos
const resultTxP = await this.prisma.serviceItem.findMany({
  where: {
    ...productoFilter,
    service: {
      id_instru: { not: null },
      id_parte: { not: null },
      ...fechasInvFilter,
      ...configuracionFilter,
      ...customerFilter,
      ...usuarioFilter,
      ...instruFilter,
      ...parteFilter,
    },
  },
  select: {
    price: true,
    quantity: true,
    porIva: true,
    service: {
      select: {
        id_parte: true,
      },
    },
  },
});

// 2. Agrupar SOLO por máquina
const groupedTxP = resultTxP.reduce((acc, item) => {
  const idParte = item.service?.id_parte;
  if (!idParte) return acc;

  if (!acc[idParte]) {
    acc[idParte] = {
      id_parte: idParte,
      total: 0,
      totalCan: 0,
    };
  }

  acc[idParte].total +=
    (item.price || 0) *
    (item.quantity || 0) *
    (1 + (item.porIva || 0) / 100);

  acc[idParte].totalCan += 1;

  return acc;
}, {} as Record<string, {
  id_parte: string;
  total: number;
  totalCan: number;
}>);

// 3. Convertir a array
const allDataTxP = Object.values(groupedTxP);

// 4. Ordenar y TOP 10
const top10TxP = allDataTxP
  .sort((a, b) => b.total - a.total) // 💰 ranking por total
  .slice(0, 10);

// 5. (OPCIONAL) traer nombre de máquina
const partesIds = top10TxP.map(m => m.id_parte);

const partes = await this.prisma.parte.findMany({
  where: {
    id: { in: partesIds },
  },
  select: {
    id: true,
    // ajustá este campo según tu modelo
    name: true
  },
});

const mapPartes = Object.fromEntries(
  partes.map(m => [m.id, m])
);

// 6. Resultado final
const TarxPar = top10TxP.map(m => ({
  parteId: m.id_parte,
  parte: mapPartes[m.id_parte]?.name || '',
  total: m.total,
  totalCan: m.totalCan,
}));

///////tarxpar




      ///dilval

    const resultdilVal = await this.prisma.serviceItem.findMany({
      where: {
    ...productoFilter,
        service: {
          id_instru: { not: null },
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...instruFilter,
          ...parteFilter,
        },
      },
      select: {
        terminado: true,
        price: true,
        quantity: true,
        porIva: true,
      },
    });

    const groupedTar = resultdilVal.reduce((acc, item) => {
      const key = item.terminado ? 'terminado' : 'pendiente';

      if (!acc[key]) {
        acc[key] = { total: 0, totalCan: 0 };
      }

      acc[key].total += (item.price || 0) * (item.quantity || 0) * (1+(item.porIva/100) || 0);
      acc[key].totalCan += 1;

      return acc;
    }, {} as Record<string, { total: number; totalCan: number }>);

    const dilVal = Object.entries(groupedTar).map(([key, value]) => ({
      _id: key,
      total: value.total,
      totalCan: value.totalCan,
    }));

      ///dilval



///orders
const servicesData = await this.prisma.service.aggregate({
  where: {
            id_instru: {not: null},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...instruFilter,
        ...parteFilter,
  },
  _count: {
    _all: true,
  },
  _sum: {
    total: true,
  },
});

const orders = [
  {
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  },
];
///orders

const Users = await this.prisma.user.count();
const users = [
  {
    _id: null,
    numUsers: Users
  }
  ]
const Customers = await this.prisma.customer.count();
const customers = [
  {
    _id: null,
    numCustomers: Customers
  }
  ]
      return {
        MaqxTar,
        TarxPar,
          // top10PartesSTVal,
          // top10PartesTerVal,
          // top10Maquinas,
          orders,
          users,
          customers,
          // top10Partes,
          dilVal,
      };



  }
//////dashTar


  
//////dashCli

  async dashboardCli(query: any) {


///filtroparaborrar
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


    // let userCli: Customer;
    // if ( usuario ) {
    //   userCli = await this.prisma.customer.findUnique({
    //   where: { usuario },
    //   });
    // }
    // if ( !userCli ) 
    //   throw new NotFoundException(`Usuario with email, name or no "${ usuario }" not found`);
    
    
    
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

    
    
    
    // --- Fechas ---
    const fechasInvFilter =
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
    const instruFilter = instru && instru !== 'all' ? {id_instru: String(instru)} : {};
    const configuracionFilter =
    configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};
    
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};

    const productoFilter = producto && producto !== 'all' ? { productId: String(producto) } : {};
    const productoOrderItemFilter =
      producto && producto !== 'all'
        ? {
            serviceItems: {
              some: {
                productId: String(producto),
              },
            },
          }
        : {};
            
    ///filtroparaborrar
    



/////toptentarxmaq
// 1. Traer datos
const resulttarmaq = await this.prisma.serviceItem.findMany({
  where: {
    ...productoFilter,
    ...estadoFilter,
    service: {
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
      ...obserFilter,
      ...estadoFilter,
      ...registroFilter,
    },
  },
  select: {
    productId: true,
    price: true,
    quantity: true,
    porIva: true,
  },
});

// 2. Agrupar por productId
const groupedTarMaq = resulttarmaq.reduce((acc, item) => {
  const key = item.productId;

  if (!acc[key]) {
    acc[key] = {
      productId: key,
      total: 0,
      totalCan: 0,
    };
  }

  acc[key].total +=
    (item.price || 0) *
    (item.quantity || 0) *
    (1 + (item.porIva || 0) / 100);

  acc[key].totalCan += 1;

  return acc;
}, {} as Record<number, { productId: number; total: number; totalCan: number }>);

// 3. Obtener IDs únicos
// const productosIds = Object.values(groupedTarMaq).map(p => p.productId);
const productosIds = [...new Set(
  Object.values(groupedTarMaq).map(p => String(p.productId))
)];

// 4. Traer nombres de productos
const productos = await this.prisma.product.findMany({
  where: {
    id: { in: productosIds },
  },
  select: {
    id: true,
    title: true, // 👈 ajustá si tu campo es distinto
  },
});

// 5. Crear mapa id → nombre
const mapProductos = Object.fromEntries(
  productos.map(p => [p.id, p.title])
);

// 6. Resultado final con nombre + ordenado
const TarxMaq = Object.values(groupedTarMaq)
  .map(item => ({
    productId: item.productId,
    producto: mapProductos[item.productId] || 'Sin nombre',
    total: item.total,
    totalCan: item.totalCan,
  }))
  .sort((a, b) => b.total - a.total); // 👈 orden por total

/////toptentarxmaq


/////toptentarxpar
// 1. Traer datos
const resulttarpar = await this.prisma.serviceItem.findMany({
  where: {
    ...productoFilter,
    ...estadoFilter,
    service: {
      id_instru: { not: null },
      id_parte: { not: null },
      ...fechasInvFilter,
      ...configuracionFilter,
      ...customerFilter,
      ...usuarioFilter,
      ...instruFilter,
      ...parteFilter,
      ...maquinaFilter,
      ...encargadoFilter,
      ...obserFilter,
      ...estadoFilter,
      ...registroFilter,
    },
  },
  select: {
    productId: true,
    price: true,
    quantity: true,
    porIva: true,
  },
});

// 2. Agrupar por productId
const groupedTarPar = resulttarpar.reduce((acc, item) => {
  const key = item.productId;

  if (!acc[key]) {
    acc[key] = {
      productId: key,
      total: 0,
      totalCan: 0,
    };
  }

  acc[key].total +=
    (item.price || 0) *
    (item.quantity || 0) *
    (1 + (item.porIva || 0) / 100);

  acc[key].totalCan += 1;

  return acc;
}, {} as Record<number, { productId: number; total: number; totalCan: number }>);

// 3. Obtener IDs únicos
// const productosIds = Object.values(groupedTarPar).map(p => p.productId);
const productosIdsPar = [...new Set(
  Object.values(groupedTarPar).map(p => String(p.productId))
)];

// 4. Traer nombres de productos
const productosPar = await this.prisma.product.findMany({
  where: {
    id: { in: productosIdsPar },
  },
  select: {
    id: true,
    title: true, // 👈 ajustá si tu campo es distinto
  },
});

// 5. Crear mapa id → nombre
const mapProductosPar = Object.fromEntries(
  productosPar.map(p => [p.id, p.title])
);

// 6. Resultado final con nombre + ordenado
const TarxPar = Object.values(groupedTarPar)
  .map(item => ({
    productId: item.productId,
    producto: mapProductos[item.productId] || 'Sin nombre',
    total: item.total,
    totalCan: item.totalCan,
  }))
  .sort((a, b) => b.total - a.total); // 👈 orden por total

/////toptentarxpar



///instrumentostop10
const topInstrumentosTra = await this.prisma.service.groupBy({
  by: ['id_instru'],
  where: {
    id_instru: { not: null },
    id_maquin: { not: null }, // 👈 opcional (dejalo si querés solo órdenes con máquina)
    ...fechasInvFilter,
    ...configuracionFilter,
    ...customerFilter,
    ...usuarioFilter,
    ...instruFilter,
    ...parteFilter,
    ...maquinaFilter,
    ...encargadoFilter,
    ...obserFilter,
    ...estadoFilter,
    ...registroFilter,
    ...productoOrderItemFilter,
  },
  _sum: {
    total: true,
  },
  _count: {
    id_instru: true,
  },
  orderBy: {
    _sum: {
      total: 'desc',
    },
  },
  take: 10,
});

// 👉 traer nombres de instrumentos
const instrumentosTopTra = await this.prisma.instrumento.findMany({
  where: {
    id: { in: topInstrumentosTra.map(c => c.id_instru!) },
  },
  select: {
    id: true,
    name: true,
  },
});

// 👉 map id → nombre
const mapInstrumentosTra = Object.fromEntries(
  instrumentosTopTra.map(i => [i.id, i.name])
);

// 👉 resultado final
const top10InstrumentosxMaq = topInstrumentosTra.map(c => ({
  instrumentoId: c.id_instru,
  instrumento: mapInstrumentosTra[c.id_instru!] || 'Sin nombre',
  totalSales: c._sum.total ?? 0,
  totalOrders: c._count.id_instru ?? 0,
}));

///instrumentostop10

      ///instrumentostop10
      const topInstrumentosTraPar = await this.prisma.service.groupBy({
        by: ['id_instru'],
        where: {
          id_instru: { not: null },
          id_parte: { not: null }, // 👈 opcional (dejalo si querés solo órdenes con máquina)
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...instruFilter,
          ...parteFilter,
          ...maquinaFilter,
          ...encargadoFilter,
          ...obserFilter,
          ...estadoFilter,
          ...registroFilter,
          ...productoOrderItemFilter,
        },
        _sum: {
          total: true,
        },
        _count: {
          id_instru: true,
        },
        orderBy: {
          _sum: {
            total: 'desc',
          },
        },
        take: 10,
      });

      // 👉 traer nombres de instrumentos
      const instrumentosTopTraPar = await this.prisma.instrumento.findMany({
        where: {
          id: { in: topInstrumentosTraPar.map(c => c.id_instru!) },
        },
        select: {
          id: true,
          name: true,
        },
      });

      // 👉 map id → nombre
      const mapInstrumentosTraPar = Object.fromEntries(
        instrumentosTopTraPar.map(i => [i.id, i.name])
      );

      // 👉 resultado final
      const top10InstrumentosxPar = topInstrumentosTraPar.map(c => ({
        instrumentoId: c.id_instru,
        instrumento: mapInstrumentosTraPar[c.id_instru!] || 'Sin nombre',
        totalSales: c._sum.total ?? 0,
        totalOrders: c._count.id_instru ?? 0,
      }));

      ///instrumentostop10


///orders
const servicesData = await this.prisma.service.aggregate({
  where: {
        OR: [
          { id_maquin: {not: null} },
          { id_parte: {not: null} },
        ],

        id_instru: {not: null},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...instruFilter,
        ...parteFilter,
        ...maquinaFilter,
        ...encargadoFilter,
        ...obserFilter,
        ...estadoFilter,
        ...registroFilter,
        ...productoOrderItemFilter,
  },
  _count: {
    _all: true,
  },
  _sum: {
    total: true,
  },
});

const orders = [
  {
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  },
];
///orders

const Users = await this.prisma.user.count();
const users = [
  {
    _id: null,
    numUsers: Users
  }
  ]
const Customers = await this.prisma.customer.count();
const customers = [
  {
    _id: null,
    numCustomers: Customers
  }
  ]
      return {
          // top10PartesSTVal,
          // top10PartesTerVal,
          // top10Maquinas,
          top10InstrumentosxMaq,
          top10InstrumentosxPar,
          orders,
          // users,
          // customers,
          // top10Partes,
          // dilVal,
          TarxPar,
          TarxMaq,
      };



  }
//////dashCli


//////dashPar

  async dashboardPar(query: any) {


///filtroparaborrar
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


    // --- Fechas ---
    const fechasInvFilter =
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
    const instruFilter = instru && instru !== 'all' ? {id_instru: String(instru)} : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};
    const productoFilter = producto && producto !== 'all' ? { productId: String(producto) } : {};
    const productoOrderItemFilter =
      producto && producto !== 'all'
        ? {
            serviceItems: {
              some: {
                productId: String(producto),
              },
            },
          }
        : {};

///filtroparaborrar


        ///Maquinastop10STer
        const topMaquinas = await this.prisma.service.groupBy({
          by: ['id_parte'],
          where: {
            terminado:false,
            id_instru: {not: null},
            id_parte: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,
            
          },
          _sum: {
            total: true
          },
          _count: {
            id_parte: true   // 👈 cantidad de registros por usuario
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const maquinasTop = await this.prisma.parte.findMany({
          where: {
            id: { in: topMaquinas.map(c => c.id_parte!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapMaquinas = Object.fromEntries(
          maquinasTop.map(c => [c.id, c.name])
        );

        const top10PartesSTVal = topMaquinas.map(c => ({
          parteId: c.id_parte,
          parte: mapMaquinas[c.id_parte!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_parte || 0
        }));


        ///Maquinastop10STer

        ///Maquinastop10Ter
        const topMaquinasTer = await this.prisma.service.groupBy({
          by: ['id_parte'],
          where: {
            terminado:true,
            id_instru: {not: null},
            id_parte: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,
            
          },
          _sum: {
            total: true
          },
          _count: {
            id_parte: true   // 👈 cantidad de registros por usuario
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const maquinasTopTer = await this.prisma.parte.findMany({
          where: {
            id: { in: topMaquinasTer.map(c => c.id_parte!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapMaquinasTer = Object.fromEntries(
          maquinasTopTer.map(c => [c.id, c.name])
        );

        const top10PartesTerVal = topMaquinasTer.map(c => ({
          parteId: c.id_parte,
          parte: mapMaquinasTer[c.id_parte!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_parte || 0
        }));


        ///Maquinastop10Ter


      ///dilval

    const resultdilVal = await this.prisma.serviceItem.findMany({
      where: {
          ...productoFilter,
          ...estadoFilter,
        service: {
          id_instru: { not: null },
          id_parte: {not: null},
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...instruFilter,
          ...parteFilter,
          ...maquinaFilter,
          ...encargadoFilter,
          ...obserFilter,
          ...estadoFilter,
          ...registroFilter,
        },
      },
      select: {
        terminado: true,
        price: true,
        quantity: true,
        porIva: true,
      },
    });

    const grouped = resultdilVal.reduce((acc, item) => {
      const key = item.terminado ? 'terminado' : 'pendiente';

      if (!acc[key]) {
        acc[key] = { total: 0, totalCan: 0 };
      }

      acc[key].total += (item.price || 0) * (item.quantity || 0) * (1+(item.porIva/100) || 0);
      acc[key].totalCan += 1;

      return acc;
    }, {} as Record<string, { total: number; totalCan: number }>);

    const dilVal = Object.entries(grouped).map(([key, value]) => ({
      _id: key,
      total: value.total,
      totalCan: value.totalCan,
    }));

      ///dilval

/////toptentarxpar
// 1. Traer datos
const resulttarmaq = await this.prisma.serviceItem.findMany({
  where: {
    ...productoFilter,
    service: {
      id_instru: { not: null },
      id_parte: { not: null },
      ...fechasInvFilter,
      ...configuracionFilter,
      ...customerFilter,
      ...usuarioFilter,
      ...instruFilter,
      ...parteFilter,
      ...maquinaFilter,
      ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
    },
  },
  select: {
    productId: true,
    price: true,
    quantity: true,
    porIva: true,
  },
});

// 2. Agrupar por productId
const groupedTarMaq = resulttarmaq.reduce((acc, item) => {
  const key = item.productId;

  if (!acc[key]) {
    acc[key] = {
      productId: key,
      total: 0,
      totalCan: 0,
    };
  }

  acc[key].total +=
    (item.price || 0) *
    (item.quantity || 0) *
    (1 + (item.porIva || 0) / 100);

  acc[key].totalCan += 1;

  return acc;
}, {} as Record<number, { productId: number; total: number; totalCan: number }>);

// 3. Obtener IDs únicos
// const productosIds = Object.values(groupedTarMaq).map(p => p.productId);
const productosIds = [...new Set(
  Object.values(groupedTarMaq).map(p => String(p.productId))
)];

// 4. Traer nombres de productos
const productos = await this.prisma.product.findMany({
  where: {
    id: { in: productosIds },
  },
  select: {
    id: true,
    title: true, // 👈 ajustá si tu campo es distinto
  },
});

// 5. Crear mapa id → nombre
const mapProductos = Object.fromEntries(
  productos.map(p => [p.id, p.title])
);

// 6. Resultado final con nombre + ordenado
const TarxPar = Object.values(groupedTarMaq)
  .map(item => ({
    productId: item.productId,
    producto: mapProductos[item.productId] || 'Sin nombre',
    total: item.total,
    totalCan: item.totalCan,
  }))
  .sort((a, b) => b.total - a.total); // 👈 orden por total

/////toptentarxpar


    ///maquinastop10
    const topMaquinasTra = await this.prisma.service.groupBy({
          by: ['id_parte'],
          where: {
            id_instru: {not: null},
            id_parte: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,

          },
          _sum: {
            total: true
          },
          _count: {
            id_parte: true 
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const maquinasTopTra = await this.prisma.parte.findMany({
          where: {
            id: { in: topMaquinasTra.map(c => c.id_parte!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapPartesTra = Object.fromEntries(
          maquinasTopTra.map(c => [c.id, c.name])
        );

        const top10PartesxOrd = topMaquinasTra.map(c => ({
          parteId: c.id_parte,
          parte: mapPartesTra[c.id_parte!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_parte || 0
        }));

        ///maquinastop10

      ///instrumentostop10
      const topInstrumentosTra = await this.prisma.service.groupBy({
        by: ['id_instru'],
        where: {
          id_instru: { not: null },
          id_parte: { not: null }, // 👈 opcional (dejalo si querés solo órdenes con máquina)
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...instruFilter,
          ...parteFilter,
          ...maquinaFilter,
          ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
          ...productoOrderItemFilter,
        },
        _sum: {
          total: true,
        },
        _count: {
          id_instru: true,
        },
        orderBy: {
          _sum: {
            total: 'desc',
          },
        },
        take: 10,
      });

      // 👉 traer nombres de instrumentos
      const instrumentosTopTra = await this.prisma.instrumento.findMany({
        where: {
          id: { in: topInstrumentosTra.map(c => c.id_instru!) },
        },
        select: {
          id: true,
          name: true,
        },
      });

      // 👉 map id → nombre
      const mapInstrumentosTra = Object.fromEntries(
        instrumentosTopTra.map(i => [i.id, i.name])
      );

      // 👉 resultado final
      const top10InstrumentosxPar = topInstrumentosTra.map(c => ({
        instrumentoId: c.id_instru,
        instrumento: mapInstrumentosTra[c.id_instru!] || 'Sin nombre',
        totalSales: c._sum.total ?? 0,
        totalOrders: c._count.id_instru ?? 0,
      }));

      ///instrumentostop10



    ///partetop10
        const topPartes = await this.prisma.service.groupBy({
          by: ['id_parte'],
          where: {
            id_instru: {not: null},
            id_parte: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...parteFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,

          },
          _sum: {
            total: true
          },
          _count: {
            id_parte: true   // 👈 esto cuenta las órdenes
          },   

          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const partesTop = await this.prisma.parte.findMany({
          where: {
            id: { in: topPartes.map(c => c.id_parte!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapPartes = Object.fromEntries(
          partesTop.map(c => [c.id, c.name])
        );

        const top10Partes = topPartes.map(c => ({
          parteId: c.id_parte,
          parte: mapPartes[c.id_parte!],
          totalSales: c._sum.total || 0
        }));

        ///partetop10


///orders
const servicesData = await this.prisma.service.aggregate({
  where: {
            id_instru: {not: null},
            id_parte: {not: null},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...instruFilter,
        ...parteFilter,
        ...maquinaFilter,
        ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
        ...productoOrderItemFilter,
  },
  _count: {
    _all: true,
  },
  _sum: {
    total: true,
  },
});

const orders = [
  {
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  },
];
///orders

const Users = await this.prisma.user.count();
const users = [
  {
    _id: null,
    numUsers: Users
  }
  ]
const Customers = await this.prisma.customer.count();
const customers = [
  {
    _id: null,
    numCustomers: Customers
  }
  ]
      return {
          top10PartesSTVal,
          top10PartesTerVal,
          top10PartesxOrd,
          top10InstrumentosxPar,
          orders,
          users,
          customers,
          top10Partes,
          dilVal,
          TarxPar,
      };



  }
//////dashPar




//////dashMaq

  async dashboardMaq(query: any) {


///filtroparaborrar
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




    // --- Fechas ---
    const fechasInvFilter =
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
    const instruFilter = instru && instru !== 'all' ? {id_instru: String(instru)} : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};
    const productoFilter = producto && producto !== 'all' ? { productId: String(producto) } : {};
    const productoOrderItemFilter =
      producto && producto !== 'all'
        ? {
            serviceItems: {
              some: {
                productId: String(producto),
              },
            },
          }
        : {};

///filtroparaborrar


        ///Maquinastop10STer
        const topMaquinas = await this.prisma.service.groupBy({
          by: ['id_maquin'],
          where: {
            terminado:false,
            id_instru: {not: null},
            id_maquin: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,
            
          },
          _sum: {
            total: true
          },
          _count: {
            id_maquin: true   // 👈 cantidad de registros por usuario
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const maquinasTop = await this.prisma.maquina.findMany({
          where: {
            id: { in: topMaquinas.map(c => c.id_maquin!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapMaquinas = Object.fromEntries(
          maquinasTop.map(c => [c.id, c.name])
        );

        const top10MaquinasSTVal = topMaquinas.map(c => ({
          maquinaId: c.id_maquin,
          maquina: mapMaquinas[c.id_maquin!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_maquin || 0
        }));


        ///Maquinastop10STer

        ///Maquinastop10Ter
        const topMaquinasTer = await this.prisma.service.groupBy({
          by: ['id_maquin'],
          where: {
            terminado:true,
            id_instru: {not: null},
            id_maquin: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,
            
          },
          _sum: {
            total: true
          },
          _count: {
            id_maquin: true   // 👈 cantidad de registros por usuario
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const maquinasTopTer = await this.prisma.maquina.findMany({
          where: {
            id: { in: topMaquinasTer.map(c => c.id_maquin!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapMaquinasTer = Object.fromEntries(
          maquinasTopTer.map(c => [c.id, c.name])
        );

        const top10MaquinasTerVal = topMaquinasTer.map(c => ({
          maquinaId: c.id_maquin,
          maquina: mapMaquinasTer[c.id_maquin!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_maquin || 0
        }));


        ///Maquinastop10Ter


      ///dilval

    const resultdilVal = await this.prisma.serviceItem.findMany({
      where: {
          ...productoFilter,
          ...estadoFilter,
        service: {
          id_instru: { not: null },
          id_maquin: {not: null},
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...instruFilter,
          ...parteFilter,
          ...maquinaFilter,
          ...encargadoFilter,
          ...obserFilter,
          ...estadoFilter,
          ...registroFilter,
        },
      },
      select: {
        terminado: true,
        price: true,
        quantity: true,
        porIva: true,
      },
    });

    const grouped = resultdilVal.reduce((acc, item) => {
      const key = item.terminado ? 'terminado' : 'pendiente';

      if (!acc[key]) {
        acc[key] = { total: 0, totalCan: 0 };
      }

      acc[key].total += (item.price || 0) * (item.quantity || 0) * (1+(item.porIva/100) || 0);
      acc[key].totalCan += 1;

      return acc;
    }, {} as Record<string, { total: number; totalCan: number }>);

    const dilVal = Object.entries(grouped).map(([key, value]) => ({
      _id: key,
      total: value.total,
      totalCan: value.totalCan,
    }));

      ///dilval

/////toptentarxmaq
// 1. Traer datos
const resulttarmaq = await this.prisma.serviceItem.findMany({
  where: {
        ...productoFilter,
    service: {
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
      ...obserFilter,
      ...estadoFilter,
      ...registroFilter,
    },
  },
  select: {
    productId: true,
    price: true,
    quantity: true,
    porIva: true,
  },
});

// 2. Agrupar por productId
const groupedTarMaq = resulttarmaq.reduce((acc, item) => {
  const key = item.productId;

  if (!acc[key]) {
    acc[key] = {
      productId: key,
      total: 0,
      totalCan: 0,
    };
  }

  acc[key].total +=
    (item.price || 0) *
    (item.quantity || 0) *
    (1 + (item.porIva || 0) / 100);

  acc[key].totalCan += 1;

  return acc;
}, {} as Record<number, { productId: number; total: number; totalCan: number }>);

// 3. Obtener IDs únicos
// const productosIds = Object.values(groupedTarMaq).map(p => p.productId);
const productosIds = [...new Set(
  Object.values(groupedTarMaq).map(p => String(p.productId))
)];

// 4. Traer nombres de productos
const productos = await this.prisma.product.findMany({
  where: {
    id: { in: productosIds },
  },
  select: {
    id: true,
    title: true, // 👈 ajustá si tu campo es distinto
  },
});

// 5. Crear mapa id → nombre
const mapProductos = Object.fromEntries(
  productos.map(p => [p.id, p.title])
);

// 6. Resultado final con nombre + ordenado
const TarxMaq = Object.values(groupedTarMaq)
  .map(item => ({
    productId: item.productId,
    producto: mapProductos[item.productId] || 'Sin nombre',
    total: item.total,
    totalCan: item.totalCan,
  }))
  .sort((a, b) => b.total - a.total); // 👈 orden por total

/////toptentarxmaq


    ///maquinastop10
    const topMaquinasTra = await this.prisma.service.groupBy({
          by: ['id_maquin'],
          where: {
            id_instru: {not: null},
            id_maquin: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,

          },
          _sum: {
            total: true
          },
          _count: {
            id_maquin: true 
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const maquinasTopTra = await this.prisma.maquina.findMany({
          where: {
            id: { in: topMaquinasTra.map(c => c.id_maquin!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapMaquinasTra = Object.fromEntries(
          maquinasTopTra.map(c => [c.id, c.name])
        );

        const top10MaquinasxOrd = topMaquinasTra.map(c => ({
          maquinaId: c.id_maquin,
          maquina: mapMaquinasTra[c.id_maquin!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_maquin || 0
        }));

        ///maquinastop10
///instrumentostop10
const topInstrumentosTra = await this.prisma.service.groupBy({
  by: ['id_instru'],
  where: {
    id_instru: { not: null },
    id_maquin: { not: null }, // 👈 opcional (dejalo si querés solo órdenes con máquina)
    ...fechasInvFilter,
    ...configuracionFilter,
    ...customerFilter,
    ...usuarioFilter,
    ...instruFilter,
    ...parteFilter,
    ...maquinaFilter,
    ...encargadoFilter,
    ...obserFilter,
    ...estadoFilter,
    ...registroFilter,
    ...productoOrderItemFilter,
  },
  _sum: {
    total: true,
  },
  _count: {
    id_instru: true,
  },
  orderBy: {
    _sum: {
      total: 'desc',
    },
  },
  take: 10,
});

// 👉 traer nombres de instrumentos
const instrumentosTopTra = await this.prisma.instrumento.findMany({
  where: {
    id: { in: topInstrumentosTra.map(c => c.id_instru!) },
  },
  select: {
    id: true,
    name: true,
  },
});

// 👉 map id → nombre
const mapInstrumentosTra = Object.fromEntries(
  instrumentosTopTra.map(i => [i.id, i.name])
);

// 👉 resultado final
const top10InstrumentosxMaq = topInstrumentosTra.map(c => ({
  instrumentoId: c.id_instru,
  instrumento: mapInstrumentosTra[c.id_instru!] || 'Sin nombre',
  totalSales: c._sum.total ?? 0,
  totalOrders: c._count.id_instru ?? 0,
}));

///instrumentostop10

    ///partetop10
        const topPartes = await this.prisma.service.groupBy({
          by: ['id_parte'],
          where: {
            id_instru: {not: null},
            id_parte: { not: null },
            id_maquin: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...parteFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,

          },
          _sum: {
            total: true
          },
          _count: {
            id_parte: true   // 👈 esto cuenta las órdenes
          },   

          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const partesTop = await this.prisma.parte.findMany({
          where: {
            id: { in: topPartes.map(c => c.id_parte!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapPartes = Object.fromEntries(
          partesTop.map(c => [c.id, c.name])
        );

        const top10Partes = topPartes.map(c => ({
          parteId: c.id_parte,
          parte: mapPartes[c.id_parte!],
          totalSales: c._sum.total || 0
        }));

        ///partetop10


///orders
const servicesData = await this.prisma.service.aggregate({
  where: {
            id_instru: {not: null},
            id_maquin: {not: null},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...instruFilter,
        ...parteFilter,
        ...maquinaFilter,
        ...encargadoFilter,
        ...obserFilter,
        ...estadoFilter,
        ...registroFilter,
        ...productoOrderItemFilter,
  },
  _count: {
    _all: true,
  },
  _sum: {
    total: true,
  },
});

const orders = [
  {
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  },
];
///orders

const Users = await this.prisma.user.count();
const users = [
  {
    _id: null,
    numUsers: Users
  }
  ]
const Customers = await this.prisma.customer.count();
const customers = [
  {
    _id: null,
    numCustomers: Customers
  }
  ]
      return {
          top10MaquinasSTVal,
          top10MaquinasTerVal,
          top10MaquinasxOrd,
          top10InstrumentosxMaq,
          orders,
          users,
          customers,
          top10Partes,
          dilVal,
          TarxMaq,
      };



  }
//////dashMaq





//////dash1esc

  async dashboardEsc(query: any) {


///filtroparaborrar
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


    // --- Fechas ---
    const fechasInvFilter =
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
    const instruFilter = instru && instru !== 'all' ? {id_instru: String(instru)} : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    const productoFilter = producto && producto !== 'all' ? { productId: String(producto) } : {};
    const productoOrderItemFilter =
      producto && producto !== 'all'
        ? {
            serviceItems: {
              some: {
                productId: String(producto),
              },
            },
          }
        : {};
    

///filtroparaborrar


        ///Userstop10
    const topUsers = await this.prisma.service.groupBy({
          by: ['user'],
          where: {
            terminado:false,
            id_instru: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,
          },
          _sum: {
            total: true
          },
          _count: {
            user: true   // 👈 cantidad de registros por usuario
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const usersTop = await this.prisma.user.findMany({
          where: {
            id: { in: topUsers.map(c => c.user!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapUsers = Object.fromEntries(
          usersTop.map(c => [c.id, c.name])
        );

        const top10UsersSTVal = topUsers.map(c => ({
          userId: c.user,
          user: mapUsers[c.user!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.user
        }));

        ///Userstop10


    ///dilval
      // const resultdilVal = await this.prisma.serviceItem.groupBy({
      //   by: ['terminado'],
      //   where: {
      //     order: {
      //       id_instru: {not: null},
      //       ...fechasInvFilter,
      //       ...configuracionFilter,
      //       ...customerFilter,
      //       ...usuarioFilter,
      //       ...comprobanteFilter,
      //       ...parteFilter,

      //     },
      //   },
      //   _sum: {
      //     price: true,
      //   },
      //   _count: {
      //     terminado: true,
      //   },

      // });    
      // const dilVal = resultdilVal.map(r => ({
      //   _id: r.terminado ? 'terminado' : 'pendiente',
      //   total: r._sum.price || 0,
      //   totalCan: r._count.terminado || 0,
      // }));

    const resultdilVal = await this.prisma.serviceItem.findMany({
      where: {
          ...productoFilter,
          ...estadoFilter,
        service: {
          id_instru: { not: null },
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...instruFilter,
          ...parteFilter,
          ...maquinaFilter,
          ...encargadoFilter,
          ...obserFilter,
          ...estadoFilter,
          ...registroFilter,
        },
      },
      select: {
        terminado: true,
        price: true,
        quantity: true,
        porIva: true,
      },
    });

    const grouped = resultdilVal.reduce((acc, item) => {
      const key = item.terminado ? 'terminado' : 'pendiente';

      if (!acc[key]) {
        acc[key] = { total: 0, totalCan: 0 };
      }

      acc[key].total += (item.price || 0) * (item.quantity || 0) * (1+(item.porIva/100) || 0);
      acc[key].totalCan += 1;

      return acc;
    }, {} as Record<string, { total: number; totalCan: number }>);

    const dilVal = Object.entries(grouped).map(([key, value]) => ({
      _id: key,
      total: value.total,
      totalCan: value.totalCan,
    }));

      ///dilval

    ///intterVal
      const resultinsVal = await this.prisma.service.groupBy({
        by: ['terminado'],
        where: {
            id_instru: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },

      });
      const insterVal = resultinsVal.map(r => ({
        _id: r.terminado ? 'terminado' : 'pendiente',
        total: r._sum.total || 0,
        count: r._count.id,
      }));
    // ///intterVal

    ///intpubpriVal

            const servicesPubPriVal = await this.prisma.service.findMany({
              where: {
                id_instru: {not: null},
                ...fechasInvFilter,
                ...configuracionFilter,
                ...customerFilter,
                ...usuarioFilter,
                ...instruFilter,
                ...parteFilter,
                ...maquinaFilter,
                ...encargadoFilter,
                ...obserFilter,
                ...estadoFilter,
                ...registroFilter,
                ...productoOrderItemFilter,
              },
              include: {
                instrumento: {
                  select: {
                    publico: true
                  }
                }
              }
            });

            const resultVal = {
              publico: 0,
              privado: 0,
              countPublico: 0,   // 👈 contador
              countPrivado: 0    // 👈 contador
            };

            for (const service of servicesPubPriVal) {

              if (service.instrumento?.publico) {
                resultVal.publico += service.total ?? 0;
                resultVal.countPublico += 1;   // 👈 suma cantidad
              } else {
                resultVal.privado += service.total ?? 0;
                resultVal.countPrivado += 1;   // 👈 suma cantidad
              }

            }

            const PubPriVal = [
              { type: 'Publico', total: resultVal.publico, totalcont: resultVal.countPublico },
              { type: 'Privado', total: resultVal.privado, totalcont: resultVal.countPrivado },
                ]
          
    ///intpubpriVal
    ///clientestop10
    const topCustomers = await this.prisma.service.groupBy({
          by: ['id_client'],
          where: {
            id_instru: {not: null},
            id_client: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,

          },
          _sum: {
            total: true
          },
          _count: {
            id_client: true   // 👈 esto cuenta las órdenes
          },   
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const customersTop = await this.prisma.customer.findMany({
          where: {
            id: { in: topCustomers.map(c => c.id_client!) },
          },
          select: {
            id: true,
            nameCus: true
          }
        });

        const mapCustomers = Object.fromEntries(
          customersTop.map(c => [c.id, c.nameCus])
        );

        const top10Clients = topCustomers.map(c => ({
          customerId: c.id_client,
          customer: mapCustomers[c.id_client!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_client || 0
        }));

        ///clientestop10
    ///partetop10
        const topPartes = await this.prisma.service.groupBy({
          by: ['id_parte'],
          where: {
            id_instru: {not: null},
            id_parte: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...parteFilter,
            ...usuarioFilter,
            ...instruFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            ...obserFilter,
            ...estadoFilter,
            ...registroFilter,
            ...productoOrderItemFilter,

          },
          _sum: {
            total: true
          },
          _count: {
            id_parte: true   // 👈 esto cuenta las órdenes
          },          
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const partesTop = await this.prisma.parte.findMany({
          where: {
            id: { in: topPartes.map(c => c.id_parte!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapPartes = Object.fromEntries(
          partesTop.map(c => [c.id, c.name])
        );

        const top10Partes = topPartes.map(c => ({
          parteId: c.id_parte,
          parte: mapPartes[c.id_parte!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_parte || 0
        }));

        ///partetop10

    ///categorias    
      const categories = await this.prisma.product.groupBy({
        by: ['category'],
        _count: {
          category: true,
        },
      });

      const productCategories = categories.map((item) => ({
        _id: item.category,
        count: item._count.category,
      }));
///categorias    

///services
const servicesData = await this.prisma.service.aggregate({
  where: {
            id_instru: {not: null},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...instruFilter,
        ...parteFilter,
        ...maquinaFilter,
        ...encargadoFilter,
        ...obserFilter,
        ...estadoFilter,
        ...registroFilter,
        ...productoOrderItemFilter,
  },
  _count: {
    _all: true,
  },
  _sum: {
    total: true,
  },
});

const orders = [
  {
    _id: null,
    numOrders: servicesData._count._all,
    totalSales: servicesData._sum.total || 0,
  },
];
///services

const Users = await this.prisma.user.count();
const users = [
  {
    _id: null,
    numUsers: Users
  }
  ]
const Customers = await this.prisma.customer.count();
const customers = [
  {
    _id: null,
    numCustomers: Customers
  }
  ]
      return {
          productCategories,
          orders,
          users,
          customers,
          top10Clients,
          top10Partes,
          PubPriVal,
          dilVal,
          insterVal,
          top10UsersSTVal
      };



  }
//////dash1Esc



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
