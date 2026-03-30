import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import mg from 'mailgun-js';
import * as mg from 'mailgun-js';

import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Order, Prisma, Configuration, Parte } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { ProductoFacService } from 'src/producto-fac/producto-fac.service';

import { PrismaService } from '../prisma/prisma.service';


@Injectable()
// export class InvoiceService extends PrismaClient implements OnModuleInit {

//   constructor(private readonly configurationsService: ConfigurationsService,
//               private readonly productoFacService: ProductoFacService
//   ) {
//     super();
//   }
//   async onModuleInit() {
//     await this.$connect();
//   }
  
export class InvoiceService {

  constructor(private readonly configurationsService: ConfigurationsService,
              private readonly productoFacService: ProductoFacService,
              private prisma: PrismaService) {}

  

//////dashMaq

  async dashboardMaq(query: any) {


///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  parte,
  maquina,
  encargado,
  comprobante,
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
    const maquinaFilter = maquina && maquina !== 'all' ? { maquin: String(maquina) } : {};
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encar: String(encargado) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar


        ///Userstop10
    const topMaquinas = await this.prisma.order.groupBy({
          by: ['id_maquin'],
          where: {
            terminado:false,
            id_instru: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,
            ...maquinaFilter,
            ...encargadoFilter,
            
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
          userId: c.id_maquin,
          id_maquin: mapMaquinas[c.id_maquin!],
          totalSales: c._sum.total || 0,
          totalOrders: c._count.id_maquin
        }));

        ///Userstop10


    ///dilval
      // const resultdilVal = await this.prisma.orderItem.groupBy({
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

    const resultdilVal = await this.prisma.orderItem.findMany({
      where: {
        order: {
          id_instru: { not: null },
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...comprobanteFilter,
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
      const resultinsVal = await this.prisma.order.groupBy({
        by: ['terminado'],
        where: {
            id_instru: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,
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

            const ordersPubPriVal = await this.prisma.order.findMany({
              where: {
                id_instru: {not: null},
                ...fechasInvFilter,
                ...configuracionFilter,
                ...customerFilter,
                ...usuarioFilter,
                ...comprobanteFilter,
                ...parteFilter,
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

            for (const order of ordersPubPriVal) {

              if (order.instrumento?.publico) {
                resultVal.publico += order.total ?? 0;
                resultVal.countPublico += 1;   // 👈 suma cantidad
              } else {
                resultVal.privado += order.total ?? 0;
                resultVal.countPrivado += 1;   // 👈 suma cantidad
              }

            }

            const PubPriVal = [
              { type: 'Publico', total: resultVal.publico, totalcont: resultVal.countPublico },
              { type: 'Privado', total: resultVal.privado, totalcont: resultVal.countPrivado },
                ]
          
    ///intpubpriVal
    ///clientestop10
    const topCustomers = await this.prisma.order.groupBy({
          by: ['id_client'],
          where: {
            id_instru: {not: null},
            id_client: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,

          },
          _sum: {
            total: true
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
          totalSales: c._sum.total || 0
        }));

        ///clientestop10
    ///partetop10
        const topPartes = await this.prisma.order.groupBy({
          by: ['id_parte'],
          where: {
            id_instru: {not: null},
            id_parte: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...parteFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,

          },
          _sum: {
            total: true
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

///orders
const ordersData = await this.prisma.order.aggregate({
  where: {
            id_instru: {not: null},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
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
    numOrders: ordersData._count._all,
    totalSales: ordersData._sum.total || 0,
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
          productCategories,
          orders,
          users,
          customers,
          top10Clients,
          top10Partes,
          PubPriVal,
          dilVal,
          insterVal,
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
  supplier,
  parte,
  encargado,
  comprobante,
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
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar


        ///Userstop10
    const topUsers = await this.prisma.order.groupBy({
          by: ['user'],
          where: {
            terminado:false,
            id_instru: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,
            
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
      // const resultdilVal = await this.prisma.orderItem.groupBy({
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

    const resultdilVal = await this.prisma.orderItem.findMany({
      where: {
        order: {
          id_instru: { not: null },
          ...fechasInvFilter,
          ...configuracionFilter,
          ...customerFilter,
          ...usuarioFilter,
          ...comprobanteFilter,
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
      const resultinsVal = await this.prisma.order.groupBy({
        by: ['terminado'],
        where: {
            id_instru: {not: null},
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,
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

            const ordersPubPriVal = await this.prisma.order.findMany({
              where: {
                id_instru: {not: null},
                ...fechasInvFilter,
                ...configuracionFilter,
                ...customerFilter,
                ...usuarioFilter,
                ...comprobanteFilter,
                ...parteFilter,
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

            for (const order of ordersPubPriVal) {

              if (order.instrumento?.publico) {
                resultVal.publico += order.total ?? 0;
                resultVal.countPublico += 1;   // 👈 suma cantidad
              } else {
                resultVal.privado += order.total ?? 0;
                resultVal.countPrivado += 1;   // 👈 suma cantidad
              }

            }

            const PubPriVal = [
              { type: 'Publico', total: resultVal.publico, totalcont: resultVal.countPublico },
              { type: 'Privado', total: resultVal.privado, totalcont: resultVal.countPrivado },
                ]
          
    ///intpubpriVal
    ///clientestop10
    const topCustomers = await this.prisma.order.groupBy({
          by: ['id_client'],
          where: {
            id_instru: {not: null},
            id_client: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,

          },
          _sum: {
            total: true
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
          totalSales: c._sum.total || 0
        }));

        ///clientestop10
    ///partetop10
        const topPartes = await this.prisma.order.groupBy({
          by: ['id_parte'],
          where: {
            id_instru: {not: null},
            id_parte: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...parteFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...parteFilter,

          },
          _sum: {
            total: true
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

///orders
const ordersData = await this.prisma.order.aggregate({
  where: {
            id_instru: {not: null},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
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
    numOrders: ordersData._count._all,
    totalSales: ordersData._sum.total || 0,
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


  //////dash1

  async dashboard(query: any) {


///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  parte,
  encargado,
  comprobante,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar



    ///Productos10Buy
            const itemsProBuy = await this.prisma.orderItem.findMany({
          where: {
            order: {
              salbuy: 'BUY',
              invNum: { gt: 0 },
              ...fechasInvFilter,
                  ...configuracionFilter,
                  ...customerFilter,
                  ...usuarioFilter,
                  ...comprobanteFilter,
                  ...supplierFilter,
                  ...encargadoFilter,
                  ...parteFilter,
            }
          },
          include: {
            product: {
              select: {
                title: true,
                category: true
              }
            }
          }
        });

        const productosMapBuy = new Map<string, any>();

        itemsProBuy.forEach(item => {
          const total = (item.price || 0) * (item.quantity || 0);

          if (!productosMapBuy.has(item.productId)) {
            productosMapBuy.set(item.productId, {
              nombre: item.product?.title || 'Sin nombre',
              total: 0,
              cantidad: 0
            });
          }

          const prod = productosMapBuy.get(item.productId);

          prod.total += total;
          prod.cantidad += item.quantity || 0;
        });

        const top10ProductosBuy = Array.from(productosMapBuy.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);
          
    ///Productos10Buy

    ///Productos10
            const itemsPro = await this.prisma.orderItem.findMany({
          where: {
            order: {
              salbuy: 'SALE',
              invNum: { gt: 0 },
              ...fechasInvFilter,
                  ...configuracionFilter,
                  ...customerFilter,
                  ...usuarioFilter,
                  ...comprobanteFilter,
                  ...supplierFilter,
                  ...encargadoFilter,
                  ...parteFilter,
            }
          },
          include: {
            product: {
              select: {
                title: true,
                category: true
              }
            }
          }
        });

        const productosMap = new Map<string, any>();

        itemsPro.forEach(item => {
          const total = (item.price || 0) * (item.quantity || 0);

          if (!productosMap.has(item.productId)) {
            productosMap.set(item.productId, {
              nombre: item.product?.title || 'Sin nombre',
              total: 0,
              cantidad: 0
            });
          }

          const prod = productosMap.get(item.productId);

          prod.total += total;
          prod.cantidad += item.quantity || 0;
        });

        const top10Productos = Array.from(productosMap.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);
          
    ///Productos10

    ///Categorias10Buy
            const itemsBuy = await this.prisma.orderItem.findMany({
              where: {
                order: {
                  salbuy: 'BUY',
                  invNum: { gt: 0 },
                  ...fechasInvFilter,

                  ...configuracionFilter,
                  ...customerFilter,
                  ...usuarioFilter,
                  ...comprobanteFilter,
                  ...supplierFilter,
                  ...encargadoFilter,
                  ...parteFilter,
                }
              },
              include: {
                product: {
                  select: {
                    category: true
                  }
                }
              }
            });

            const categoriasMapBuy = new Map<string, number>();

            itemsBuy.forEach(item => {
              const cat = item.product?.category || 'Sin categoría';
              const total = (item.price * item.quantity ) || 0; // o quantity * price

              categoriasMapBuy.set(cat, (categoriasMapBuy.get(cat) || 0) + total);
            });

            const top10CategoriasBuy = Array.from(categoriasMapBuy.entries())
              .map(([categoria, total]) => ({
                categoria,
                total
              }))
              .sort((a, b) => b.total - a.total)
              .slice(0, 10);
              
        ///Categorias10Buy
    ///Categorias10
            const items = await this.prisma.orderItem.findMany({
              where: {
                order: {
                  salbuy: 'SALE',
                  invNum: { gt: 0 },
                  ...fechasInvFilter,

                  ...configuracionFilter,
                  ...customerFilter,
                  ...usuarioFilter,
                  ...comprobanteFilter,
                  ...supplierFilter,
                  ...encargadoFilter,
                  ...parteFilter,
                }
              },
              include: {
                product: {
                  select: {
                    category: true
                  }
                }
              }
            });

            const categoriasMap = new Map<string, number>();

            items.forEach(item => {
              const cat = item.product?.category || 'Sin categoría';
              const total = (item.price * item.quantity ) || 0; // o quantity * price

              categoriasMap.set(cat, (categoriasMap.get(cat) || 0) + total);
            });

            const top10Categorias = Array.from(categoriasMap.entries())
              .map(([categoria, total]) => ({
                categoria,
                total
              }))
              .sort((a, b) => b.total - a.total)
              .slice(0, 10);
              
        ///Categorias10
    ///PVentastop10Buy
    const topPVentasBuy = await this.prisma.order.groupBy({
          by: ['id_config'],
          where: {
            salbuy: 'BUY',
            invNum: { gt: 0 },
            id_config: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...supplierFilter,
            ...encargadoFilter,
            ...parteFilter,

          },
          _sum: {
            totalBuy: true
          },
          orderBy: {
            _sum: {
              totalBuy: 'desc'
            }
          },
          take: 10
        });

        const pventasTopBuy = await this.prisma.configuration.findMany({
          where: {
            id: { in: topPVentasBuy.map(c => c.id_config!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapPVentasBuy = Object.fromEntries(
          pventasTopBuy.map(c => [c.id, c.name])
        );

        const top10PVentasBuy = topPVentasBuy.map(c => ({
          pventaId: c.id_config,
          pventa: mapPVentasBuy[c.id_config!],
          totalBuys: c._sum.totalBuy || 0
        }));

        ///PVentastop10Buy

        ///PVentastop10

    const topPVentas = await this.prisma.order.groupBy({
          by: ['id_config'],
          where: {
            salbuy: 'SALE',
            invNum: { gt: 0 },
            id_config: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...supplierFilter,
            ...encargadoFilter,
            ...parteFilter,

          },
          _sum: {
            total: true
          },
          orderBy: {
            _sum: {
              total: 'desc'
            }
          },
          take: 10
        });

        const pventasTop = await this.prisma.configuration.findMany({
          where: {
            id: { in: topPVentas.map(c => c.id_config!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapPVentas = Object.fromEntries(
          pventasTop.map(c => [c.id, c.name])
        );

        const top10PVentas = topPVentas.map(c => ({
          pventaId: c.id_config,
          pventa: mapPVentas[c.id_config!],
          totalSales: c._sum.total || 0
        }));



        ///PVentastop10

        ///Userstop10Buy
    const topUsersBuy = await this.prisma.order.groupBy({
          by: ['user'],
          where: {
            salbuy: 'BUY',
            invNum: { gt: 0 },
            user: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...supplierFilter,
            ...encargadoFilter,
            ...parteFilter,

          },
          _sum: {
            totalBuy: true
          },
          orderBy: {
            _sum: {
              totalBuy: 'desc'
            }
          },
          take: 10
        });

        const usersTopBuy = await this.prisma.user.findMany({
          where: {
            id: { in: topUsersBuy.map(c => c.user!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapUsersBuy = Object.fromEntries(
          usersTopBuy.map(c => [c.id, c.name])
        );

        const top10UsersBuy = topUsersBuy.map(c => ({
          userId: c.user,
          user: mapUsersBuy[c.user!],
          totalBuys: c._sum.totalBuy || 0
        }));

        ///Userstop10Buy

        ///Userstop10
    const topUsers = await this.prisma.order.groupBy({
          by: ['user'],
          where: {
            salbuy: 'SALE',
            invNum: { gt: 0 },
            user: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...supplierFilter,
            ...encargadoFilter,
            ...parteFilter,

          },
          _sum: {
            total: true
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

        const top10Users = topUsers.map(c => ({
          userId: c.user,
          user: mapUsers[c.user!],
          totalSales: c._sum.total || 0
        }));

        ///Userstop10

    ///Supplierstop10
    const topSuppliers = await this.prisma.order.groupBy({
          by: ['supplier'],
          where: {
            salbuy: 'BUY',
            invNum: { gt: 0 },
            supplier: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...supplierFilter,
            ...encargadoFilter,
            ...parteFilter,

          },
          _sum: {
            totalBuy: true
          },
          orderBy: {
            _sum: {
              totalBuy: 'desc'
            }
          },
          take: 10
        });

        const suppliersTop = await this.prisma.supplier.findMany({
          where: {
            id: { in: topSuppliers.map(c => c.supplier!) },
          },
          select: {
            id: true,
            name: true
          }
        });

        const mapSuppliers = Object.fromEntries(
          suppliersTop.map(c => [c.id, c.name])
        );

        const top10Suppliers = topSuppliers.map(c => ({
          supplierId: c.supplier,
          supplier: mapSuppliers[c.supplier!],
          totalBuys: c._sum.totalBuy || 0
        }));

        ///Supplierstop10

        ///clientestop10
    const topCustomers = await this.prisma.order.groupBy({
          by: ['id_client'],
          where: {
            salbuy: 'SALE',
            invNum: { gt: 0 },
            id_client: { not: null },
            ...fechasInvFilter,
            ...configuracionFilter,
            ...customerFilter,
            ...usuarioFilter,
            ...comprobanteFilter,
            ...supplierFilter,
            ...encargadoFilter,
            ...parteFilter,

          },
          _sum: {
            total: true
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
          totalSales: c._sum.total || 0
        }));

        ///clientestop10

        ///partetop10
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
///daily      
    type DailyOrder = {
      _id: string;
      orders: number;
      sales: number;
      buys: number;
    };
    // const { fechasFilter, configuracionFilter, customerFilter, usuarioFilter } = query;

    const invoices = await this.prisma.order.findMany({
      where: {
        invNum: { gt: 0 },
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
      },
      select: {
        invDat: true,
        total: true,
        totalBuy: true,
      },
    });

    const dailyMap: Record<string, DailyOrder> = {};

    for (const inv of invoices) {

      const date = inv.invDat.toISOString().split('T')[0];

      if (!dailyMap[date]) {
        dailyMap[date] = {
          _id: date,
          orders: 0,
          sales: 0,
          buys: 0,
        };
      }

      dailyMap[date].orders += 1;
      dailyMap[date].sales += inv.total || 0;
      dailyMap[date].buys += inv.totalBuy || 0;
    }

    const dailyOrders = Object.values(dailyMap).sort((a, b) =>
      a._id.localeCompare(b._id)
    );

///daily      

///dailymoney
type DailyMoney = {
  _id: string;
  inputs: number;
  outputs: number;
};
  const receipts = await this.prisma.receipt.findMany({
    // where: {
    //   recNum: { gt: 0 },
    // },
      where: {
        recNum: { gt: 0 },
        ...fechasRecFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
      },


    select: {
      recDat: true,
      total: true,
      totalBuy: true,
    },
  });

  const dailyMapMoney: Record<string, DailyMoney> = {};

  for (const rec of receipts) {

    const date = rec.recDat.toISOString().split('T')[0];

    if (!dailyMapMoney[date]) {
      dailyMapMoney[date] = {
        _id: date,
        inputs: 0,
        outputs: 0,
      };
    }

    dailyMapMoney[date].inputs += rec.total || 0;
    dailyMapMoney[date].outputs += rec.totalBuy || 0;
  }

  const dailyMoney = Object.values(dailyMapMoney).sort((a, b) =>
    a._id.localeCompare(b._id)
  );


///dailymoney      
///orders
const ordersData = await this.prisma.order.aggregate({
  where: {
    invNum: { gt: 0 },
    salbuy: 'SALE',
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
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
    numOrders: ordersData._count._all,
    totalSales: ordersData._sum.total || 0,
  },
];
///orders
///ctacteV
type CtacteDaily = {
  _id: string;
  salesS: number;
  inputsS: number;
  salesB: number;
  inputsB: number;
};


  const receipts1 = await this.prisma.receipt.findMany({
    where: {
      recNum: { gt: 0 },
        ...fechasRecFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },
    select: {
      recDat: true,
      total: true,
      totalBuy: true,
    },
  });

  const invoicesSale = await this.prisma.order.findMany({
    where: {
      invNum: { gt: 0 },
      // ajuste: false,
      salbuy: "SALE",
      isHaber: false,
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },
    select: {
      invDat: true,
      total: true,
      totalBuy: true,
    },
  });

  const invoicesBuy = await this.prisma.order.findMany({
    where: {
      invNum: { gt: 0 },
      salbuy: "BUY",
      isHaber: true,
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },
    select: {
      invDat: true,
      total: true,
      totalBuy: true,
    },
  });

  const map: Record<string, CtacteDaily> = {};

  // receipts (inputs)
  for (const rec of receipts1) {
    const date = rec.recDat.toISOString().split('T')[0];

    if (!map[date]) {
      map[date] = {
        _id: date,
        salesS: 0,
        inputsS: 0,
        salesB: 0,
        inputsB: 0,
      };
    }

    map[date].inputsS += rec.total || 0;
    map[date].inputsB += rec.totalBuy || 0;
  }

  // invoices (sales)
  for (const inv of invoicesSale) {
    const date = inv.invDat.toISOString().split('T')[0];

    if (!map[date]) {
      map[date] = {
        _id: date,
        salesS: 0,
        inputsS: 0,
        salesB: 0,
        inputsB: 0,
      };
    }

    map[date].salesS += inv.total || 0;
    map[date].salesB += inv.totalBuy || 0;
  }


  const ctacteSale = Object.values(map).sort((a, b) =>
    a._id.localeCompare(b._id)
  );
  // invoices (buys)

  const mapBuy: Record<string, CtacteDaily> = {};

// receipts (inputs)
  for (const rec of receipts1) {
    const date = rec.recDat.toISOString().split('T')[0];

    if (!mapBuy[date]) {
      mapBuy[date] = {
        _id: date,
        salesS: 0,
        inputsS: 0,
        salesB: 0,
        inputsB: 0,
      };
    }

    mapBuy[date].inputsS += rec.total || 0;
    mapBuy[date].inputsB += rec.totalBuy || 0;
  }

  for (const inv of invoicesBuy) {
    const date = inv.invDat.toISOString().split('T')[0];

    if (!mapBuy[date]) {
      mapBuy[date] = {
        _id: date,
        salesS: 0,
        inputsS: 0,
        salesB: 0,
        inputsB: 0,
      };
    }

    mapBuy[date].salesS += inv.total || 0;
    mapBuy[date].salesB += inv.totalBuy || 0;
  }

  const ctacteBuy = Object.values(mapBuy).sort((a, b) =>
    a._id.localeCompare(b._id)
  );
///ctacte
///proIO
type ProductIO = {
  _id: string;
  salio: number;
  entro: number;
};


  const invoices2 = await this.prisma.order.findMany({
    where: {
        ajuste: false,
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },
    select: {
      salbuy: true,
      orderItems: {
        select: {
          title: true,
          quantity: true,
        },
      },
    },
  });

  const map2: Record<string, ProductIO> = {};

  for (const inv of invoices2) {

    for (const item of inv.orderItems) {

      const title = item.title;

      if (!map2[title]) {
        map2[title] = {
          _id: title,
          salio: 0,
          entro: 0,
        };
      }

      if (inv.salbuy === 'SALE') {
        map2[title].salio += item.quantity;
      }

      if (inv.salbuy === 'BUY') {
        map2[title].entro += item.quantity;
      }
    }
  }

  const producIO = Object.values(map2).sort((a, b) =>
    a._id.localeCompare(b._id)
  );

///proIO

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
          dailyOrders,
          dailyMoney,
          orders,
          users,
          customers,
          ctacteSale,
          ctacteBuy,
          producIO,
          top10Clients,
          // top10Partes,
          // PubPri,
          // PubPriVal,
          // inster,
          // insterVal
          // dilter,
          // dilVal,
          top10Suppliers,
          top10Users,
          top10UsersBuy,
          top10PVentas,
          top10PVentasBuy,
          top10Categorias,
          top10CategoriasBuy,
          top10Productos,
          top10ProductosBuy
      };



  }
//////dash1

//////dash

  async dashboardTes(query: any) {
  // isAuth,
  // // isAdmin,
    // const numberOfOrders = await Order.count();
    // const paidOrders = await Order.find({ isPaid: true }).count();
    // const numberOfClients = await User.find({ role: 'client' }).count();
    // const numberOfProducts = await Product.count();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();
    
    const numberOfOrders = await this.prisma.order.count();

    const paidOrders = await this.prisma.order.count({
      where: { isPaid: true },
    });

    const numberOfClients = await this.prisma.user.count({
      where: { role: 'client' },
    });

    const numberOfProducts = await this.prisma.product.count();

    const productsWithNoInventory = await this.prisma.product.count({
      where: { inStock: 0 },
    });

    const lowInventory = await this.prisma.product.count({
      where: { inStock: { lte: 10 } },
    });

    return {
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInventory,
      notPaidOrders: numberOfOrders - paidOrders
    };
  }
//////dash

  ///// proiye
async proiye(query: any) {

///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  comprobante,
  parte,
  encargado,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar
  const invoices = await this.prisma.order.findMany({
    where: {
        invNum: {gt : 0}, ajuste: false,
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },
    include: {
      orderItems: true,
      configuration: true,
    },
  });

  const map: Record<string, any> = {};

  for (const inv of invoices) {

    const configId = inv.id_config;

    if (!map[configId]) {
      map[configId] = {
        configId,
        clientNameCus: inv.configuration?.name,
        clientcodCus: inv.configuration?.codCon,
        totalAmountClient: 0,
        totalAmountClientBuy: 0,
        products: [],
      };
    }

    for (const item of inv.orderItems) {

      const amount = item.quantity * item.price;

      let product = map[configId].products.find(
        (p) => p.title === item.title
      );

      if (!product) {
        product = {
          title: item.title,
          totalQuantity: 0,
          totalAmount: 0,
          totalIngreso: 0,
          totalEgreso: 0,
          totalMontoIngreso: 0,
          totalMontoEgreso: 0,
          saldo: 0,
        };

        map[configId].products.push(product);
      }

      product.totalQuantity += item.quantity;
      product.totalAmount += amount;

      if (inv.salbuy === "SALE") {
        product.totalIngreso += item.quantity;
        product.totalMontoIngreso += amount;
        map[configId].totalAmountClient += amount;
      } else {
        product.totalEgreso += item.quantity;
        product.totalMontoEgreso += amount;
        map[configId].totalAmountClientBuy += amount;
      }

      product.saldo =
        product.totalMontoIngreso - product.totalMontoEgreso;
    }
  }

  const resultado = Object.values(map).sort((a: any, b: any) =>
    a.clientNameCus.localeCompare(b.clientNameCus)
  );

  return { resultado };
} 
  ///// proiye
  ///// prosup
async prosup(query: any) {

  type ProSupMovimiento = {
    supplier?: any
    title?: string
    quantity?: number
    amount?: number
  }

///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  comprobante,
  encargado,
  parte,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar

  const factura = 'BUY';

  const f1 = fech1 ? new Date(fech1) : null;
  const f2 = fech2 ? new Date(fech2) : null;

  const fechasFilter =
    !f1 && !f2
      ? {}
      : !f1 && f2
      ? { invDat: { lte: f2 } }
      : f1 && !f2
      ? { invDat: { gte: f1 } }
      : { invDat: { gte: f1, lte: f2 } };

  const orders = await this.prisma.order.findMany({
   
    where: {
      salbuy: factura, invNum: {gt : 0}, ajuste: false,
      ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },



    include: {
      supplier1: true,
      orderItems: true,
    },

  });

  const movimientos: ProSupMovimiento[] = [];

  // equivalente a $unwind
  for (const order of orders) {

    for (const item of order.orderItems) {

      movimientos.push({
        supplier: order.supplier1,
        title: item.title,
        quantity: item.quantity,
        amount: item.quantity * item.price,
      });

    }

  }

  const agrupadoPorProducto: any = {};

  for (const r of movimientos) {

    const productTitle = r.title || 'Producto sin nombre';

    if (!agrupadoPorProducto[productTitle]) {

      agrupadoPorProducto[productTitle] = {
        suppliers: {},
        productTotalQuantity: 0,
        productTotalAmount: 0,
      };

    }

    const supplierId = r.supplier?.id || 'sin_supplier';

    const supplierName =
      r.supplier?.name ||
      'Proveedor desconocido';

    if (!agrupadoPorProducto[productTitle].suppliers[supplierId]) {

      agrupadoPorProducto[productTitle].suppliers[supplierId] = {
        supplierId,
        supplierName,
        totalQuantity: 0,
        totalAmount: 0,
      };

    }

    const sup = agrupadoPorProducto[productTitle].suppliers[supplierId];

    sup.totalQuantity += r.quantity || 0;
    sup.totalAmount += r.amount || 0;

    agrupadoPorProducto[productTitle].productTotalQuantity += r.quantity || 0;
    agrupadoPorProducto[productTitle].productTotalAmount += r.amount || 0;

  }

  const resultado = Object.keys(agrupadoPorProducto).map((productTitle) => ({

    _id: productTitle,
    suppliers: Object.values(agrupadoPorProducto[productTitle].suppliers),
    productTotalQuantity: agrupadoPorProducto[productTitle].productTotalQuantity,
    productTotalAmount: agrupadoPorProducto[productTitle].productTotalAmount,

  }));

  return {
    resultado
  };

}
  ///// prosup

  ///// procus
async procus(query: any) {

  type ProCusMovimiento = {
    client?: any
    title?: string
    quantity?: number
    amount?: number
  }

///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  comprobante,
  encargado,
  parte,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar

  const factura = 'SALE';

  const f1 = fech1 ? new Date(fech1) : null;
  const f2 = fech2 ? new Date(fech2) : null;


  const orders = await this.prisma.order.findMany({

    where: {
      salbuy: factura, invNum: {gt : 0}, ajuste: false,
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },



    include: {
      customer: true,
      orderItems: true,
    },

  });

  const movimientos: ProCusMovimiento[] = [];

  // equivalente a $unwind
  for (const order of orders) {

    for (const item of order.orderItems) {

      movimientos.push({
        client: order.customer,
        title: item.title,
        quantity: item.quantity,
        amount: item.quantity * item.price,
      });

    }

  }

  const agrupadoPorProducto: any = {};

  for (const r of movimientos) {

    const productTitle = r.title || 'Producto sin nombre';

    if (!agrupadoPorProducto[productTitle]) {

      agrupadoPorProducto[productTitle] = {
        clients: {},
        productTotalQuantity: 0,
        productTotalAmount: 0,
      };

    }

    const clientId = r.client?.id || 'sin_cliente';

    const clientName =
      r.client?.nameCus ||
      r.client?.name ||
      'Cliente desconocido';

    if (!agrupadoPorProducto[productTitle].clients[clientId]) {

      agrupadoPorProducto[productTitle].clients[clientId] = {
        clientId,
        clientName,
        totalQuantity: 0,
        totalAmount: 0,
      };

    }

    const cli = agrupadoPorProducto[productTitle].clients[clientId];

    cli.totalQuantity += r.quantity || 0;
    cli.totalAmount += r.amount || 0;

    agrupadoPorProducto[productTitle].productTotalQuantity += r.quantity || 0;
    agrupadoPorProducto[productTitle].productTotalAmount += r.amount || 0;

  }

  const resultado = Object.keys(agrupadoPorProducto).map((productTitle) => ({

    _id: productTitle,
    clients: Object.values(agrupadoPorProducto[productTitle].clients),
    productTotalQuantity: agrupadoPorProducto[productTitle].productTotalQuantity,
    productTotalAmount: agrupadoPorProducto[productTitle].productTotalAmount,

  }));

  return {
    resultado
  };

}
  ///// procus

  ///// suppro
  async suppro(query: any) {

  type SupProMovimiento = {
    supplier?: any
    title?: string
    quantity?: number
    amount?: number
  }

///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  comprobante,
  encargado,
  parte,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar

  const factura = 'BUY';

  const f1 = fech1 ? new Date(fech1) : null;
  const f2 = fech2 ? new Date(fech2) : null;


  const orders = await this.prisma.order.findMany({

    where: {
      salbuy: factura, invNum: {gt : 0}, ajuste:false,
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },


    include: {
      supplier1: true,
      orderItems: true,
    },

  });

  const movimientos: SupProMovimiento[] = [];

  // equivalente a $unwind
  for (const order of orders) {

    for (const item of order.orderItems) {

      movimientos.push({
        supplier: order.supplier1,
        title: item.title,
        quantity: item.quantity,
        amount: item.quantity * item.price,
      });

    }

  }

  const agrupadoPorSupplier: any = {};

  // equivalente a $group
  for (const r of movimientos) {

    const supplierId = r.supplier?.id || 'sin_supplier';
    const codSup = r.supplier?.codSup;
    const supplierNombre = r.supplier?.name || 'Supplier sin nombre';

    if (!agrupadoPorSupplier[supplierId]) {

      agrupadoPorSupplier[supplierId] = {
        codSup,
        supplier: supplierNombre,
        products: {},
        totalAmountSupplier: 0,
      };

    }

    if (!agrupadoPorSupplier[supplierId].products[r.title]) {

      agrupadoPorSupplier[supplierId].products[r.title] = {
        title: r.title,
        totalQuantity: 0,
        totalAmount: 0,
      };

    }

    const prod = agrupadoPorSupplier[supplierId].products[r.title];

    prod.totalQuantity += r.quantity || 0;
    prod.totalAmount += r.amount || 0;

    agrupadoPorSupplier[supplierId].totalAmountSupplier += r.amount || 0;

  }

  const resultado = Object.keys(agrupadoPorSupplier).map((id) => ({

    supplierId: id,
    suppliercodSup: agrupadoPorSupplier[id].codSup,
    supplierName: agrupadoPorSupplier[id].supplier,
    totalAmountSupplier: agrupadoPorSupplier[id].totalAmountSupplier,
    products: Object.values(agrupadoPorSupplier[id].products),

  }));

  return {
    resultado
  };
}
  ///// suppro


  ///// cuspro
async cuspro(query: any) {

  type CusProMovimiento = {
    customer?: any
    title?: string
    quantity?: number
    amount?: number
  }

///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  comprobante,
  encargado,
  parte,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar

  const factura = 'SALE';

  const f1 = fech1 ? new Date(fech1) : null;
  const f2 = fech2 ? new Date(fech2) : null;


  const orders = await this.prisma.order.findMany({
    where: {
      salbuy: factura, invNum: {gt : 0}, ajuste: false,
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },

    include: {
      customer: true,
      orderItems: true,
    },
  });

  const movimientos: CusProMovimiento[] = [];

  // equivalente a $unwind
  for (const order of orders) {

    for (const item of order.orderItems) {

      movimientos.push({
        customer: order.customer,
        title: item.title,
        quantity: item.quantity,
        amount: item.quantity * item.price,
      });

    }

  }

  const agrupadoPorCustomer: any = {};

  // equivalente a $group
  for (const r of movimientos) {

    const customerId = r.customer?.id || 'sin_cliente';
    const codCust = r.customer?.codCus;
    const customerNombre = r.customer?.nameCus || 'Cliente sin nombre';

    if (!agrupadoPorCustomer[customerId]) {

      agrupadoPorCustomer[customerId] = {
        codCust,
        customer: customerNombre,
        products: {},
        totalAmountClient: 0,
      };

    }

    if (!agrupadoPorCustomer[customerId].products[r.title]) {

      agrupadoPorCustomer[customerId].products[r.title] = {
        title: r.title,
        totalQuantity: 0,
        totalAmount: 0,
      };

    }

    const prod = agrupadoPorCustomer[customerId].products[r.title];

    prod.totalQuantity += r.quantity || 0;
    prod.totalAmount += r.amount || 0;

    agrupadoPorCustomer[customerId].totalAmountClient += r.amount || 0;
  }


const resultado = Object.keys(agrupadoPorCustomer).map((id) => ({

  clientId: id,
  clientcodCus: agrupadoPorCustomer[id].codCust,
  clientNameCus: agrupadoPorCustomer[id].customer,
  totalAmountClient: agrupadoPorCustomer[id].totalAmountClient,
  products: Object.values(agrupadoPorCustomer[id].products),

}));

  return {
    resultado
  };
}  ///// cuspro


  ///// ctasup
async ctasup(query: any) {

  type CtaSupMovimiento = {
    docDat?: Date | null
    haber?: number | null
    debe?: number | null
    recNum?: number | null
    invNum?: number | null
    supplier?: any
    configuration?: any
    user?: any
    comprobante?: any
  }

///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  comprobante,
  encargado,
  parte,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar


  const factura = 'BUY';

  const f1 = fech1 ? new Date(fech1) : null;
  const f2 = fech2 ? new Date(fech2) : null;


  const recibos = await this.prisma.receipt.findMany({
      
      where: {
        salbuy: factura,
        ...fechasRecFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },

///filtroparaborrar

    include: {
      supplier1: true,
      configuration: true,
      user1: true,
    },
  });

  const facturas = await this.prisma.order.findMany({
    
    where: {
      salbuy: factura, invNum: {gt : 0},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },


    include: {
      supplier1: true,
      configuration: true,
      user1: true,
      comprobante: true,
    },
  });

  // recibos → haber
  const movimientosRec: CtaSupMovimiento[] = (recibos as any).map((r: any) => ({
    docDat: r.recDat,
    // haber: r.totalBuy,
    debe: r.totalBuy,
    haber: 0,
    recNum: r.recNum,
    supplier: r.supplier1,
    configuration: r.configuration,
    user: r.user1,
  }));

  // facturas proveedor
  const movimientosInv: CtaSupMovimiento[] = (facturas as any).map((o: any) => ({
    docDat: o.invDat,
    invNum: o.invNum,
    supplier: o.supplier1,
    configuration: o.configuration,
    user: o.user1,
    comprobante: o.comprobante,
    
    debe: !o.isHaber ? o.totalBuy : 0,
    haber: o.isHaber ? o.totalBuy : 0,
    

  }));

  const ctacte: CtaSupMovimiento[] = [
    ...movimientosRec,
    ...movimientosInv,
  ];

  // ordenar por proveedor y fecha
  ctacte.sort((a, b) => {

    const sa = a.supplier?.id || '';
    const sb = b.supplier?.id || '';

    if (sa < sb) return -1;
    if (sa > sb) return 1;

    const da = new Date(a.docDat || 0).getTime();
    const db = new Date(b.docDat || 0).getTime();

    return da - db;
  });

  const agrupadoPorSupplier: any = {};

  for (const r of ctacte) {

    const supplierId = r.supplier?.id || 'sin_supplier';
    const codSupp = r.supplier?.codSup;
    const supplierNombre = r.supplier?.name || 'Proveedor sin nombre';

    if (!agrupadoPorSupplier[supplierId]) {
      agrupadoPorSupplier[supplierId] = {
        codSupp,
        supplier: supplierNombre,
        movimientos: [],
        saldoTotal: 0,
      };
    }

    const descrip = r.comprobante?.nameCom || 'ORDEN DE PAGO';

    const movimiento = {
      _uid: crypto.randomUUID(),
      fecha: r.docDat,
      compDes: descrip,
      nameUse: r.user?.name,
      nameCon: r.configuration?.name,
      compNum: r.invNum || r.recNum,
      totalBuy: r.debe || 0,
      total: r.haber || 0,
      saldoMovimiento: (r.haber || 0) - (r.debe || 0),
    };

    const sup = agrupadoPorSupplier[supplierId];

    sup.saldoTotal += movimiento.saldoMovimiento;

    movimiento['saldoAcumulado'] = sup.saldoTotal;

    sup.movimientos.push(movimiento);
  }

  const resultado = Object.keys(agrupadoPorSupplier).map((id) => ({
    supplier: id,
    codSupp: agrupadoPorSupplier[id].codSupp,
    nombreSupplier: agrupadoPorSupplier[id].supplier,
    movimientos: agrupadoPorSupplier[id].movimientos,
    saldoTotal: agrupadoPorSupplier[id].saldoTotal,
  }));

  return {
    resultado,
    ctacte,
  };
}  
  ///// ctasup
  ///// ctacte
async ctacus(query: any) {

  type CtaCteMovimiento = {
    docDat?: Date | null
    haber?: number | null
    debe?: number | null
    recNum?: number | null
    invNum?: number | null
    customer?: any
    configuration?: any
    user?: any
    comprobante?: any
  }

///filtroparaborrar
const {
  fech1,
  fech2,
  configuracion,
  usuario,
  customer,
  supplier,
  comprobante,
  encargado,
  parte,
} = query;

    // --- Fechas ---
    const fechasInvFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };
    // --- Fechas ---
    const fechasRecFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
    const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
    const comprobanteFilter = comprobante && comprobante !== 'all' ? {codCom: String(comprobante)} : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

///filtroparaborrar
  const factura = 'SALE';

  const f1 = fech1 ? new Date(fech1) : null;
  const f2 = fech2 ? new Date(fech2) : null;

  const recibos = await this.prisma.receipt.findMany({
    where: {
        salbuy: factura,
        ...fechasRecFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },


    include: {
      customer: true,
      configuration: true,
      user1: true,
    },
  });

  const facturas = await this.prisma.order.findMany({
    
    ///filtroparaborrar
    where: {
      salbuy: factura, invNum: {gt : 0},
        ...fechasInvFilter,
        ...configuracionFilter,
        ...customerFilter,
        ...usuarioFilter,
        ...comprobanteFilter,
        ...supplierFilter,
        ...encargadoFilter,
        ...parteFilter,
    },

///filtroparaborrar


    include: {
      customer: true,
      configuration: true,
      user1: true,
      comprobante: true,
    },
  });

  // Convertir recibos
  // const movimientosRec: CtaCteMovimiento[] = recibos.map((r) => ({
  const movimientosRec: CtaCteMovimiento[] = (recibos as any).map((r: any) => ({
    docDat: r.recDat,
    // haber: r.total,
    debe: r.total,
    haber: 0,
    recNum: r.recNum,
    customer: r.customer,
    configuration: r.configuration,
    user: r.user1,
  }));

  // Convertir facturas
  // const movimientosInv: CtaCteMovimiento[] = facturas.map((o) => ({
    const movimientosInv: CtaCteMovimiento[] = (facturas as any).map((o: any) => ({
      docDat: o.invDat,
      // debe: o.total,
      invNum: o.invNum,
      customer: o.customer,
      configuration: o.configuration,
      user: o.user1,
      comprobante: o.comprobante,
      
      debe:  o.isHaber ? o.total : 0,
      haber: !o.isHaber ? o.total : 0,
      
    }));
    
  const ctacte: CtaCteMovimiento[] = [
    ...movimientosRec,
    ...movimientosInv
  ];

  // ordenar por cliente y fecha
  ctacte.sort((a, b) => {

    const ca = a.customer?.id || '';
    const cb = b.customer?.id || '';

    if (ca < cb) return -1;
    if (ca > cb) return 1;

    const da = new Date(a.docDat || 0).getTime();
    const db = new Date(b.docDat || 0).getTime();

    return da - db;
  });

  const agrupadoPorCustomer: any = {};

  for (const r of ctacte) {

    const customerId = r.customer?.id || 'sin_cliente';
    const codCust = r.customer?.codCus;
    const customerNombre = r.customer?.nameCus || 'Cliente sin nombre';

    if (!agrupadoPorCustomer[customerId]) {
      agrupadoPorCustomer[customerId] = {
        codCust,
        customer: customerNombre,
        movimientos: [],
        saldoTotal: 0,
      };
    }

    const descrip = r.comprobante?.nameCom || 'RECIBO';

    const movimiento = {
      _uid: crypto.randomUUID(),
      fecha: r.docDat,
      compDes: descrip,
      nameUse: r.user?.name,
      nameCon: r.configuration?.name,
      compNum: r.invNum || r.recNum,
      totalBuy: r.debe || 0,
      total: r.haber || 0,
      saldoMovimiento: (r.haber || 0) - (r.debe || 0),
    };

    const cust = agrupadoPorCustomer[customerId];

    cust.saldoTotal += movimiento.saldoMovimiento;

    movimiento['saldoAcumulado'] = cust.saldoTotal;

    cust.movimientos.push(movimiento);
  }

  const resultado = Object.keys(agrupadoPorCustomer).map((id) => ({
    customer: id,
    codCust: agrupadoPorCustomer[id].codCust,
    nombreCliente: agrupadoPorCustomer[id].customer,
    movimientos: agrupadoPorCustomer[id].movimientos,
    saldoTotal: agrupadoPorCustomer[id].saldoTotal,
  }));

  return {
    resultado,
    ctacte
  };
}///// ctacte


// async geninvRem(createInvoiceDto: any, id:any) {
//   const {invoiceAux, receiptAux} = createInvoiceDto;
//   const { orderItems, orderAddress } = invoiceAux;
//   const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;


//     try {
// //////////////inv
//     //////////  GENERA RECIBO /////////////////
//     let recAux = 0;
//     let recNumero = 0;
//     let invNumero = 0;
//     let remNumero = 0;
//     let invrecNum = 0;
//     let invrecDat = null;


//     if ( receiptAux.recDat !== "" && receiptAux.desVal !== "") {
//       //////////  numera RECIBO /////////////////
//       invrecDat = invoiceAux.invDat;
      
//       if (receiptAux.recNum > 0)
//         {recNumero = receiptAux.recNum }
//         else {
//           const configId = receiptAux.codCon._id;
//           const configuracion = await this.prisma.configuration.findUnique(
//           {
//             where: { id: configId },
//           }
//         );

//           if (configuracion) {
//             await this.prisma.configuration.update(
//                           {
//               where: { id: configId },
//               data: {
//                 numIntRec: { increment: 1 },
//               },
//             }

//             );
//           }
//           recNumero = configuracion.numIntRec + 1;
//         };
//         //////////  numera RECIBO /////////////////
  
//       const receipt = await this.prisma.receipt.create({
//           data: {
//       subTotal: receiptAux.subTotal,
//       total: receiptAux.total,
//       totalBuy: receiptAux.totalBuy,
//       // user: receiptAux.codUse,
//       // id_client: receiptAux.codCus,
//       // id_config: receiptAux.codCon,
//       // user: receiptAux.user,
//       // id_config2: receiptAux.codCon2,
//       codConNum: +receiptAux.codConNum,
//       // codCom: receiptAux.codCom,
//       // supplier: receiptAux.codSup,
//       //////////  numera remito /////////////////
//       recNum: recNumero,
//       //////////  numera remito /////////////////
//       recDat: safeDate(receiptAux.recDat),
//       desval: receiptAux.desVal,
//       notes: receiptAux.notes,
//       salbuy: receiptAux.salbuy,
// /////////////



//             // relaciones
//             customer: receiptAux.codCus._id ? { connect: { id: receiptAux.codCus._id } } : undefined,
//             configuration: receiptAux.codCon._id ? { connect: { id: receiptAux.codCon._id } } : undefined,
//             supplier1: receiptAux.codSup ? { connect: { id: receiptAux.codSup } } : undefined,
//             user1: receiptAux.user ? { connect: { id: receiptAux.user } } : undefined,


            
//             // order items
//             receiptItems: {
//               create: receiptAux.receiptItems.map(item => ({
//                 desval: item.desval,
//                 numval: +item.numval,
//                 amountval: +item.amountval,
//                 // venDat: safeDate(item.venDat),
//                 // productId: item.productId,
//                 valuee: item._id,
//               }))
//             }
//           },
//           include: { receiptItems: true }, // incluye los items en la respuesta
//         });
//   }else{
//     recAux = 0;  
//     // recDat = null;
//   }
//       //////////  GENERA RECIBO /////////////////
//         //////////  numera factura /////////////////
      
//       if (invoiceAux.invNum > 0)
//         {invNumero = invoiceAux.invNum }
//         else {
//           const comproId = invoiceAux.codCom;
//           // const comprobante = await this.prisma.comprobante.findById(comproId);
//           const comprobante = await this.prisma.comprobante.findUnique(
//           {
//             where: { id: comproId },
//           }
//         );
//           // if (comprobante) {
//           //   comprobante.numInt = comprobante.numInt + 1;
//           //   await comprobante.save();
//           // }
          
//           if (comprobante) {
//             await this.prisma.comprobante.update(
//               {
//                 where: { id: comproId },
//                 data: {
//                   numInt: { increment: 1 },
//                 },
//               }
              
//             );
//           }
//           invNumero = comprobante.numInt + 1;

//         };
//         //////////  numera factura /////////////////

//         if (recAux > 0) {
//           invrecNum = recAux;
//           // invrecDat =  invoiceAux.invDat;
//           }else{
//             invrecNum = recAux;
//             // invrecDat =  invoiceAux.recDat;
//           };
// ///***
//       const invoice = await this.prisma.order.update({
//       where: { id: id},
//       data: {
//           notes : invoiceAux.notes,
//           isHaber: invoiceAux.isHaber,
//           // codCom : invoiceAux.codCom,
//           // dueDat : invoiceAux.dueDat,
//           // invDat : invoiceAux.invDat,
//           invNum : invNumero,
//           recNum : recNumero,
//           // recDat : invoiceAux.invDat,
//           dueDat: safeDate(invoiceAux.dueDat),
//           invDat: safeDate(invoiceAux.invDat),
//           recDat: safeDate(invrecDat),
//           // relaciones
//           comprobante: invoiceAux.codCom ? { connect: { id: invoiceAux.codCom } } : undefined,
            
//           },
//           include: { orderItems: true }, // incluye los items en la respuesta
//         });

//         // return { invoice };
//       const invoiceWithMongoId = {
//         ...invoice,
//         _id: invoice.id,
//       };

//       return { invoice: invoiceWithMongoId };            
//     } catch (error) {
//       this.handleExceptions( error );
//     }
      
//         ///***
// //////////////inv

// }
// async createInv(createInvoiceDto: any) {
//   const {invoiceAux, receiptAux} = createInvoiceDto;
//   const { orderItems, orderAddress } = invoiceAux;
//   const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;


//     try {
// //////////////inv
//     //////////  GENERA RECIBO /////////////////
//     let recAux = 0;
//     let recNumero = 0;
//     let invNumero = 0;
//     let remNumero = 0;
//     let invrecNum = 0;
//     let invrecDat = null;


//     if ( receiptAux.recDat !== "" && receiptAux.desVal !== "") {
//       //////////  numera RECIBO /////////////////
//       invrecDat = invoiceAux.invDat;
      
//       if (receiptAux.recNum > 0)
//         {recNumero = receiptAux.recNum }
//         else {
//           const configId = receiptAux.codCon;
//           const configuracion = await this.prisma.configuration.findUnique(
//           {
//             where: { id: configId },
//           }
//         );

//           if (configuracion) {
//             await this.prisma.configuration.update(
//                           {
//               where: { id: configId },
//               data: {
//                 numIntRec: { increment: 1 },
//               },
//             }

//             );
//           }
//           recNumero = configuracion.numIntRec + 1;
//         };
//         //////////  numera RECIBO /////////////////
  
//       const receipt = await this.prisma.receipt.create({
//           data: {
//       subTotal: receiptAux.subTotal,
//       total: receiptAux.total,
//       totalBuy: receiptAux.totalBuy,
//       // user: receiptAux.codUse,
//       // id_client: receiptAux.codCus,
//       // id_config: receiptAux.codCon,
//       // user: receiptAux.user,
//       // id_config2: receiptAux.codCon2,
//       codConNum: +receiptAux.codConNum,
//       // codCom: receiptAux.codCom,
//       // supplier: receiptAux.codSup,
//       //////////  numera remito /////////////////
//       recNum: recNumero,
//       //////////  numera remito /////////////////
//       recDat: safeDate(receiptAux.recDat),
//       desval: receiptAux.desVal,
//       notes: receiptAux.notes,
//       salbuy: receiptAux.salbuy,
// /////////////



//             // relaciones
//             customer: receiptAux.codCus ? { connect: { id: receiptAux.codCus } } : undefined,
//             configuration: receiptAux.codCon ? { connect: { id: receiptAux.codCon } } : undefined,
//             supplier1: receiptAux.codSup ? { connect: { id: receiptAux.codSup } } : undefined,
//             user1: receiptAux.user ? { connect: { id: receiptAux.user } } : undefined,


            
//             // order items
//             receiptItems: {
//               create: receiptAux.receiptItems.map(item => ({
//                 desval: item.desval,
//                 numval: +item.numval,
//                 amountval: +item.amountval,
//                 // venDat: safeDate(item.venDat),
//                 // productId: item.productId,
//                 valuee: item._id,
//               }))
//             }
//           },
//           include: { receiptItems: true }, // incluye los items en la respuesta
//         });
//   }else{
//     recAux = 0;  
//     // recDat = null;
//   }
//       //////////  GENERA RECIBO /////////////////
//       //////////  MODIFICA STOCK /////////////////
      
//     if (invoiceAux.salbuy === "SALE") {
//     if (!invoiceAux.isHaber) {
//       invoiceAux.orderItems.map(async(item) => {
//         // const product = await this.prisma.product.findById(item._id);
//         const product = await this.prisma.product.findUnique(
//           {
//             where: { id: item._id },
//           }
//         );
//         if (product) {
//           await this.prisma.product.update(
//             {
//               where: { id: item._id },
//               data: {
//                 inStock: { decrement: item.quantity },
//               },
//             }
//           );
//         }else {
//           throw new Error('Product no encontrado');
//         }

//   }
//       )

//     } else {

//       invoiceAux.orderItems.map(async(item) => {
//         // const product = await Product.findById(item._id);
//         const product = await this.prisma.product.findUnique(
//           {
//             where: { id: item._id },
//           }
//         );
//         if (product) {
//           await this.prisma.product.update(
//             {
//               where: { id: item._id },
//               data: {
//                 inStock: { increment: item.quantity },
//               },
//             }
//           );
//         }else {
//           throw new Error('Product no encontrado');
//         }
//   }
//       )

//     }
//     } else {

//       if (invoiceAux.isHaber) {
//         invoiceAux.orderItems.map(async(item) => {
//         // const product = await this.prisma.product.findById(item._id);
//         const product = await this.prisma.product.findUnique(
//           {
//             where: { id: item._id },
//           }
//         );

//           if (product) {
//           await this.prisma.product.update(
//             {
//               where: { id: item._id },
//               data: {
//                 inStock: { decrement: item.quantity },
//               },
//             }
//           );
//         }else {
//           throw new Error('Product no encontrado');
//         }

          
//     }
//         )
  
//       } else {
  
//         invoiceAux.orderItems.map(async(item) => {
//           // const product = await this.prisma.product.findById(item._id);
//         const product = await this.prisma.product.findUnique(
//           {
//             where: { id: item._id },
//           }
//         );


//           if (product) {
//           await this.prisma.product.update(
//             {
//               where: { id: item._id },
//               data: {
//                 inStock: { increment: item.quantity },
//               },
//             }
//           );
//         }else {
//           throw new Error('Product no encontrado');
//         }
     
//     }
//         )
  
//       }
//     }

    

//     //////////  MODIFICA STOCK /////////////////
//         //////////  numera factura /////////////////
      
//       if (invoiceAux.invNum > 0)
//         {invNumero = invoiceAux.invNum }
//         else {
//           const comproId = invoiceAux.codCom;
//           // const comprobante = await this.prisma.comprobante.findById(comproId);
//           const comprobante = await this.prisma.comprobante.findUnique(
//           {
//             where: { id: comproId },
//           }
//         );
//           // if (comprobante) {
//           //   comprobante.numInt = comprobante.numInt + 1;
//           //   await comprobante.save();
//           // }
          
//           if (comprobante) {
//             await this.prisma.comprobante.update(
//               {
//                 where: { id: comproId },
//                 data: {
//                   numInt: { increment: 1 },
//                 },
//               }
              
//             );
//           }
//           invNumero = comprobante.numInt + 1;

//         };
//         //////////  numera factura /////////////////

//         //////////  numera remito /////////////////
//         if (invoiceAux.salbuy === "BUY") {
//         remNumero = invoiceAux.remNum;
//         }else {
//         remNumero = 0;          
//         if (invoiceAux.geRem) {

//           if (invoiceAux.remNum > 0)
//             {remNumero = invoiceAux.remNum }
//             else {
//           const configId = receiptAux.codCon;
//           const configuracion = await this.prisma.configuration.findUnique(
//           {
//             where: { id: configId },
//           }
//         );

//           if (configuracion) {
//             await this.prisma.configuration.update(
//                           {
//               where: { id: configId },
//               data: {
//                 numIntRem: { increment: 1 },
//               },
//             }

//             );
//           }
//               remNumero = configuracion.numIntRem + 1;
//             };
//         };
//       };

//           //////////  numera remito /////////////////

        
//         if (recAux > 0) {
//           invrecNum = recAux;
//           // invrecDat =  invoiceAux.invDat;
//           }else{
//             invrecNum = recAux;
//             // invrecDat =  invoiceAux.recDat;
//           };
// ///***
//       const invoice = await this.prisma.order.create({
//           data: {
//             // orderAddress: invoiceAux.orderAddress,
//             paymentMethod: invoiceAux.paymentMethod,
//             subTotal: invoiceAux.subTotal,
//             shippingPrice: invoiceAux.shippingPrice,
//             tax: invoiceAux.tax,
//             total: invoiceAux.total,
//             totalBuy: invoiceAux.totalBuy,
//             itemsInOrder:0,
//             // user: invoiceAux.codUse,
//             // id_client: invoiceAux.codCus,
//             // id_config: invoiceAux.codCon,
//             // user: invoiceAux.user,
//             // id_config2: invoiceAux.codCon2,
//             codConNum: invoiceAux.codConNum,
//             // codCom: invoiceAux.codCom,
//             // supplier: invoiceAux.codSup,
//             //////////  numera remito /////////////////
//             invNum: invNumero,
//             remNum: remNumero,
//             // movpvNum: invoiceAux.movpvNum,
//             //////////  numera remito /////////////////
//             remDat: safeDate(invoiceAux.remDat),
//             movpvDat: safeDate(invoiceAux.movpvDat),
//             dueDat: safeDate(invoiceAux.dueDat),
//             // invNum: invoiceAux.invNum,
//             invDat: safeDate(invoiceAux.invDat),
//             // recNum: invoiceAux.recNum,
//             recNum: recNumero,
//             recDat: safeDate(invrecDat),
//             desVal: invoiceAux.desVal,
//             notes: invoiceAux.notes,
//             salbuy: invoiceAux.salbuy,
//             ajuste: invoiceAux.ajuste,
// //arreglaishaber          // //////////  Me fijo si es Compra o venta para ver haber o debe /////////////////
//           isHaber: (invoiceAux.salbuy === "SALE") ? invoiceAux.isHaber : !invoiceAux.isHaber,
//             // isHaber: invoiceAux.isHaber,
//           // //////////  Me fijo si es Compra o venta para ver haber o debe /////////////////

// /////////////



//             // relaciones
//             customer: invoiceAux.codCus ? { connect: { id: invoiceAux.codCus } } : undefined,
//             supplier1: invoiceAux.codSup ? { connect: { id: invoiceAux.codSup } } : undefined,
//             comprobante: invoiceAux.codCom ? { connect: { id: invoiceAux.codCom } } : undefined,
//             configuration: invoiceAux.codCon ? { connect: { id: invoiceAux.codCon } } : undefined,
//             configuration2: invoiceAux.codCon2 ? { connect: { id: invoiceAux.codCon2 } } : undefined,
//             // supplier1: invoiceAux.codSup ? { connect: { id: invoiceAux.codSup } } : undefined,
//             user1: invoiceAux.user ? { connect: { id: invoiceAux.user } } : undefined,


            
//             // order items
//             orderItems: {
//               create: orderItems.map(item => ({
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
//                 instrumentoId: item.instrumentoId,
//               }))
//             }
//           },
//           include: { orderItems: true }, // incluye los items en la respuesta
//         });

//         // return { invoice };
//       const invoiceWithMongoId = {
//         ...invoice,
//         _id: invoice.id,
//       };

//       return { invoice: invoiceWithMongoId };            
//     } catch (error) {
//       this.handleExceptions( error );
//     }
      
//         ///***
// //////////////inv

// }

// async createRem(createInvoiceDto: any) {
//   const { orderItems, orderAddress, ...orderData } = createInvoiceDto;

//   const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
//     try {


// //////////////
//       let remNumero = 0;
//       if (orderData.remNum > 0) {
//         remNumero = orderData.remNum;
//       } else {
//         const configId = orderData.codCon;
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
//       orderData.remNum = remNumero;    
// //////////////




//             const invoice = await this.prisma.order.create({
//           data: {
//       orderAddress: orderData.orderAddress,
//       paymentMethod: orderData.paymentMethod,
//       subTotal: orderData.subTotal,
//       shippingPrice: orderData.shippingPrice,
//       tax: orderData.tax,
//       total: orderData.total,
//       totalBuy: orderData.totalBuy,
//       itemsInOrder:0,
//       // user: orderData.codUse,
//       // id_client: orderData.codCus,
//       // id_config: orderData.codCon,
//       // user: orderData.user,
//       // id_config2: orderData.codCon2,
//       movpvNum: orderData.movpvNum,
//       movpvDat: safeDate(orderData.movpvDat),
//       codConNum: orderData.codConNum,
//       // codCom: orderData.codCom,
//       // supplier: orderData.codSup,
//       //////////  numera remito /////////////////
//       remNum: orderData.remNum,
//       //////////  numera remito /////////////////
//       remDat: safeDate(orderData.remDat),
//       dueDat: safeDate(orderData.dueDat),
//       invNum: orderData.invNum,
//       invDat: safeDate(orderData.invDat),
//       recNum: orderData.recNum,
//       recDat: safeDate(orderData.recDat),
//       desVal: orderData.desVal,
//       notes: orderData.notes,
//       salbuy: orderData.salbuy,
// /////////////



//             // relaciones
//             customer: orderData.codCus ? { connect: { id: orderData.codCus } } : undefined,
//             comprobante: orderData.codCom ? { connect: { id: orderData.codCom } } : undefined,
//             configuration: orderData.codCon ? { connect: { id: orderData.codCon } } : undefined,
//             supplier1: orderData.codSup ? { connect: { id: orderData.codSup } } : undefined,
//             user1: orderData.user ? { connect: { id: orderData.user } } : undefined,


            
//             // order items
//             orderItems: {
//               create: orderItems.map(item => ({
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
//                 instrumentoId: item.instrumentoId,



//               }))
//             }
//           },
//           include: { orderItems: true }, // incluye los items en la respuesta
//         });

//         // return { invoice };
//       const invoiceWithMongoId = {
//         ...invoice,
//         _id: invoice.id,
//       };

//       return { invoice: invoiceWithMongoId };            

//     } catch (error) {
//       this.handleExceptions( error );
//     }

// }

async geninvRem(createInvoiceDto: any, id: any) {

  const { invoiceAux, receiptAux } = createInvoiceDto;
  const { orderItems } = invoiceAux;

  const safeDate = (dateStr?: string) => dateStr ? new Date(dateStr) : null;

  try {

    const result = await this.prisma.$transaction(async (tx) => {

      let recNumero = 0;
      let invNumero = 0;
      let invrecDat: Date | null = null;

      // =========================
      // 🧾 RECIBO
      // =========================
      if (receiptAux?.recDat && receiptAux?.desVal) {

        invrecDat = safeDate(invoiceAux.invDat);

        if (receiptAux.recNum > 0) {
          recNumero = receiptAux.recNum;
        } else {

          const config = await tx.configuration.update({
            where: { id: receiptAux.codCon._id },
            data: {
              numIntRec: { increment: 1 },
            },
          });

          recNumero = config.numIntRec;
        }

        await tx.receipt.create({
          data: {
            subTotal: receiptAux.subTotal,
            total: receiptAux.total,
            totalBuy: receiptAux.totalBuy,
            codConNum: +receiptAux.codConNum,

            recNum: recNumero,
            recDat: safeDate(receiptAux.recDat),

            desval: receiptAux.desVal,
            notes: receiptAux.notes,
            salbuy: receiptAux.salbuy,

            // relaciones
            customer: receiptAux.codCus?._id
              ? { connect: { id: receiptAux.codCus._id } }
              : undefined,

            configuration: receiptAux.codCon?._id
              ? { connect: { id: receiptAux.codCon._id } }
              : undefined,

            supplier1: receiptAux.codSup
              ? { connect: { id: receiptAux.codSup } }
              : undefined,

            user1: receiptAux.user
              ? { connect: { id: receiptAux.user } }
              : undefined,

            receiptItems: {
              create: receiptAux.receiptItems.map(item => ({
                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                valuee: item._id,
              }))
            }
          },
          include: { receiptItems: true },
        });
      }

      // =========================
      // 🧾 NUMERO FACTURA
      // =========================
      if (invoiceAux.invNum > 0) {
        invNumero = invoiceAux.invNum;
      } else {

        const comprobante = await tx.comprobante.update({
          where: { id: invoiceAux.codCom },
          data: {
            numInt: { increment: 1 },
          },
        });

        invNumero = comprobante.numInt;
      }

      // =========================
      // 🧾 UPDATE FACTURA EXISTENTE
      // =========================
      const invoice = await tx.order.update({
        where: { id: id },
        data: {

          notes: invoiceAux.notes,
          isHaber: invoiceAux.isHaber,

          invNum: invNumero,
          recNum: recNumero,

          dueDat: safeDate(invoiceAux.dueDat),
          invDat: safeDate(invoiceAux.invDat),
          recDat: invrecDat,

          comprobante: invoiceAux.codCom
            ? { connect: { id: invoiceAux.codCom } }
            : undefined,
        },
        include: { orderItems: true },
      });

      return invoice;
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

async createInv(createInvoiceDto: any) {

  const { invoiceAux, receiptAux } = createInvoiceDto;
  const { orderItems } = invoiceAux;

  const safeDate = (dateStr?: string) => dateStr ? new Date(dateStr) : null;

  try {

    const result = await this.prisma.$transaction(async (tx) => {

      let recNumero = 0;
      let invNumero = 0;
      let remNumero = 0;
      let invrecDat: Date | null = null;

      // =========================
      // 🧾 RECIBO
      // =========================
      if (receiptAux?.recDat && receiptAux?.desVal) {

        invrecDat = safeDate(invoiceAux.invDat);

        if (receiptAux.recNum > 0) {
          recNumero = receiptAux.recNum;
        } else {
          const config = await tx.configuration.update({
            where: { id: receiptAux.codCon },
            data: { numIntRec: { increment: 1 } },
          });

          recNumero = config.numIntRec;
        }

        await tx.receipt.create({
          data: {
            subTotal: receiptAux.subTotal,
            total: receiptAux.total,
            totalBuy: receiptAux.totalBuy,
            codConNum: +receiptAux.codConNum,
            recNum: recNumero,
            recDat: safeDate(receiptAux.recDat),
            desval: receiptAux.desVal,
            notes: receiptAux.notes,
            salbuy: receiptAux.salbuy,

            customer: receiptAux.codCus ? { connect: { id: receiptAux.codCus } } : undefined,
            configuration: receiptAux.codCon ? { connect: { id: receiptAux.codCon } } : undefined,
            supplier1: receiptAux.codSup ? { connect: { id: receiptAux.codSup } } : undefined,
            user1: receiptAux.user ? { connect: { id: receiptAux.user } } : undefined,

            receiptItems: {
              create: receiptAux.receiptItems.map(item => ({
                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                valuee: item._id,
              }))
            }
          },
          include: { receiptItems: true },
        });
      }

      // =========================
      // 📦 STOCK (CORRECTO)
      // =========================
      for (const item of orderItems) {

        const isSale = invoiceAux.salbuy === "SALE";

        let increment = 0;

        if (isSale) {
          increment = invoiceAux.isHaber ? item.quantity : -item.quantity;
        } else {
          increment = invoiceAux.isHaber ? -item.quantity : item.quantity;
        }

        await tx.product.update({
          where: { id: item._id },
          data: {
            inStock: { increment },
          },
        });
      }

      // =========================
      // 🧾 NUMERO FACTURA
      // =========================
      if (invoiceAux.invNum > 0) {
        invNumero = invoiceAux.invNum;
      } else {
        const comp = await tx.comprobante.update({
          where: { id: invoiceAux.codCom },
          data: { numInt: { increment: 1 } },
        });

        invNumero = comp.numInt;
      }

      // =========================
      // 🚚 REMITO
      // =========================
      if (invoiceAux.salbuy === "BUY") {
        remNumero = invoiceAux.remNum;
      } else {
        if (invoiceAux.geRem) {

          if (invoiceAux.remNum > 0) {
            remNumero = invoiceAux.remNum;
          } else {
            const config = await tx.configuration.update({
              where: { id: invoiceAux.codCon },
              data: { numIntRem: { increment: 1 } },
            });

            remNumero = config.numIntRem;
          }
        }
      }

      // =========================
      // 🧾 FACTURA FINAL
      // =========================
      const invoice = await tx.order.create({
        data: {

          paymentMethod: invoiceAux.paymentMethod,
          subTotal: invoiceAux.subTotal,
          shippingPrice: invoiceAux.shippingPrice,
          tax: invoiceAux.tax,
          total: invoiceAux.total,
          totalBuy: invoiceAux.totalBuy,
          itemsInOrder: 0,

          codConNum: invoiceAux.codConNum,

          invNum: invNumero,
          remNum: remNumero,
          recNum: recNumero,

          remDat: safeDate(invoiceAux.remDat),
          movpvDat: safeDate(invoiceAux.movpvDat),
          dueDat: safeDate(invoiceAux.dueDat),
          invDat: safeDate(invoiceAux.invDat),
          recDat: invrecDat,

          desVal: invoiceAux.desVal,
          notes: invoiceAux.notes,
          salbuy: invoiceAux.salbuy,
          ajuste: invoiceAux.ajuste,

          isHaber: (invoiceAux.salbuy === "SALE")
            ? invoiceAux.isHaber
            : !invoiceAux.isHaber,

          // relaciones
          customer: invoiceAux.codCus ? { connect: { id: invoiceAux.codCus } } : undefined,
          supplier1: invoiceAux.codSup ? { connect: { id: invoiceAux.codSup } } : undefined,
          comprobante: invoiceAux.codCom ? { connect: { id: invoiceAux.codCom } } : undefined,
          configuration: invoiceAux.codCon ? { connect: { id: invoiceAux.codCon } } : undefined,
          configuration2: invoiceAux.codCon2 ? { connect: { id: invoiceAux.codCon2 } } : undefined,
          user1: invoiceAux.user ? { connect: { id: invoiceAux.user } } : undefined,

          orderItems: {
            create: orderItems.map(item => ({
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
              instrumentoId: item.instrumentoId,
            }))
          }
        },
        include: { orderItems: true },
      });

      return invoice;
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

async createRem(createInvoiceDto: any) {
  const { orderItems, orderAddress, ...orderData } = createInvoiceDto;

  const safeDate = (dateStr?: string) => dateStr ? new Date(dateStr) : null;

  try {

    const result = await this.prisma.$transaction(async (tx) => {

      let remNumero = 0;

      if (orderData.remNum > 0) {
        remNumero = orderData.remNum;
      } else {
        const configId = orderData.codCon;

        const configuracion = await tx.configuration.update({
          where: { id: configId },
          data: {
            numIntRem: { increment: 1 },
          },
        });

        // 🔥 Este valor ya viene incrementado de forma segura
        remNumero = configuracion.numIntRem;
      }

      orderData.remNum = remNumero;

      const invoice = await tx.order.create({
        data: {
          orderAddress: orderData.orderAddress,
          paymentMethod: orderData.paymentMethod,
          subTotal: orderData.subTotal,
          shippingPrice: orderData.shippingPrice,
          tax: orderData.tax,
          total: orderData.total,
          totalBuy: orderData.totalBuy,
          itemsInOrder: 0,

          movpvNum: orderData.movpvNum,
          movpvDat: safeDate(orderData.movpvDat),
          codConNum: orderData.codConNum,

          remNum: orderData.remNum,
          remDat: safeDate(orderData.remDat),
          dueDat: safeDate(orderData.dueDat),

          invNum: orderData.invNum,
          invDat: safeDate(orderData.invDat),
          recNum: orderData.recNum,
          recDat: safeDate(orderData.recDat),

          desVal: orderData.desVal,
          notes: orderData.notes,
          salbuy: orderData.salbuy,

          // relaciones
          customer: orderData.codCus ? { connect: { id: orderData.codCus } } : undefined,
          comprobante: orderData.codCom ? { connect: { id: orderData.codCom } } : undefined,
          configuration: orderData.codCon ? { connect: { id: orderData.codCon } } : undefined,
          supplier1: orderData.codSup ? { connect: { id: orderData.codSup } } : undefined,
          user1: orderData.user ? { connect: { id: orderData.user } } : undefined,

          orderItems: {
            create: orderItems.map(item => ({
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
              instrumentoId: item.instrumentoId,
            }))
          }
        },
        include: { orderItems: true },
      });

      return invoice;
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

async createOrd(createInvoiceDto: any) {
  const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;

  const { orderItems, orderAddress, ...orderData } = createInvoiceDto;

  // Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map( product => product._id );

    // const dbProducts = await this.prisma.product.find({ _id: { $in: productsIds } });
    const dbProducts = await this.prisma.product.findMany({
      where: {
        id: {
          in: productsIds,
        },
      },
    });

    try {
//////crea
    const subTotal = orderItems.reduce( ( prev, current ) => {
        const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
        if ( !currentPrice ) {
            throw new Error('Verifique el carrito de nuevo, producto no existe');
        }

        return (currentPrice * current.quantity) + prev
    }, 0 );

    // const taxRate = 0.10 ;
    const taxRate = orderItems.reduce( ( prev, current ) => (current.price * current.quantity * (current.porIva/100)) + prev, 0 );
    // const backendTotal = subTotal * ( taxRate + 1 );
    const backendTotal = subTotal + taxRate ;

    if ( orderData.total !== backendTotal ) {
        throw new Error('El total no cuadra con el monto');
    }

    // Todo bien hasta este punto
    // const newOrder = new Order({ ...req.body,
    //                              isPaid: false,
    //                              user: req.uid,
    //                              salbuy: "SALE",
    //                              ordYes: "Y",
    //                              staOrd: "NUEVA" });
    // await newOrder.save();
//////crea

      const invoice = await this.prisma.order.create({
      data: {
////agrearemito
      isPaid: false,
      salbuy: "SALE",
      ordYes: "Y",
      staOrd: "NUEVA",
////agrearemito
      paymentMethod: orderData.paymentMethod,
      subTotal: orderData.subTotal,
      shippingPrice: orderData.shippingPrice,
      tax: orderData.tax,
      total: orderData.total,
      totalBuy: orderData.totalBuy,
      itemsInOrder: orderData.numberOfItems,
      // user: orderData.codUse,
      // id_client: orderData.codCus,
      // id_config: orderData.codCon,
      // user: orderData.user,
      // id_config2: orderData.codCon2,
      movpvNum: orderData.movpvNum,
      movpvDat: safeDate(orderData.movpvDat),
      // codConNum: orderData.codConNum,
      codConNum: "0001",
      // codCom: orderData.codCom,
      // supplier: orderData.codSup,
      //////////  numera remito /////////////////
      remNum: orderData.remNum,
      //////////  numera remito /////////////////
      remDat: safeDate(orderData.remDat),
      dueDat: safeDate(orderData.dueDat),
      invNum: orderData.invNum,
      invDat: safeDate(orderData.invDat),
      recNum: orderData.recNum,
      recDat: safeDate(orderData.recDat),
      desVal: orderData.desVal,
      notes: orderData.notes,
/////////////



            // relaciones
            customer: orderData.codCus ? { connect: { id: orderData.codCus } } : undefined,
            comprobante: orderData.codCom ? { connect: { id: orderData.codCom } } : undefined,
            configuration: orderData.codCon ? { connect: { id: orderData.codCon } } : undefined,
            supplier1: orderData.codSup ? { connect: { id: orderData.codSup } } : undefined,
            user1: orderData.user ? { connect: { id: orderData.user } } : undefined,


            
            // order items
            orderItems: {
              create: orderItems.map(item => ({
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
                // productId: item.productId,
                productId: item._id,
                instrumentoId: item.instrumentoId,
              }))
            },
            orderAddress: {
              create:  {
                firstName : orderAddress.firstName,
                lastName : orderAddress.lastName,
                address : orderAddress.address,
                address2 : orderAddress.address2,
                city : orderAddress.city,
                postalCode : orderAddress.zip,
                countryId : orderAddress.country,
                // countryId : "AR",
                phone : orderAddress.phone,
                // postalCode : orderAddress.postalCode || "",
                // fullName : orderAddress.fullName || "",
                // cuit : orderAddress.cuit || "",

              }
            }
          },
          include: { orderItems: true }, // incluye los items en la respuesta
        });

        // return { invoice };
      const invoiceWithMongoId = {
        ...invoice,
        _id: invoice.id,
      };
///////mail
const mailgun = mg({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  // host: 'api.eu.mailgun.net', // 👈 IMPORTANTE si es región EU
});

    const baseUrl = () =>
      process.env.BASE_URL
        ? process.env.BASE_URL
        : process.env.NODE_ENV !== 'production'
        // ? 'http://localhost:3000'
        ? 'http://localhost:5173'
        : 'https://yourdomain.com';

        await mailgun
        .messages()
        .send(
          {
            from: 'JPZ <javier_pazz@hotmail.com>',
            // to: `${userInDB.name} <${userInDB.email}>`,
            to: `JavierPZ <javier_pazz@hotmail.com>`,
            // subject: `New order ${order._id}`,
            // html: payOrderEmailTemplate(invoiceWithMongoId),          },
            subject: `Orden Numero`,
            html: ` 
             <p>Probando orden`,
            },
          (error, body) => {
            console.log(error);
            console.log(body);
          }
        );
///////mail

      return  invoiceWithMongoId ;            

    } catch (error) {
      this.handleExceptions( error );
    }

}


// async createMov(createInvoiceDto: any) {
//   const { orderItems, orderAddress, ...orderData } = createInvoiceDto;

//   const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
//     try {


// //////////////
//       let Numero = 0;
//       if (orderData.movpvNum > 0) {
//         Numero = orderData.movpvNum;
//       } else {
//         const configId = orderData.codCon;
//         // const configuracion = await Configuration.findById(configId).session(session);
//         const configuracion = await this.prisma.configuration.findUnique(
//           {
//             where: { id: configId },
//           }
//         );
//         if (configuracion) {
//           configuracion.numIntMov += 1;
//           // await configuracion.save({ session });
//           await this.prisma.configuration.update(
//             {
//               where: { id: configId },
//               data: {
//                 numIntMov: { increment: 1 },
//               },
//             }
//           );
//           Numero = configuracion.numIntMov;
//         } else {
//           throw new Error('Configuración no encontrada');
//         }
//       }
//       orderData.movpvNum = Numero;    
// //////////////




//             const invoice = await this.prisma.order.create({
//           data: {
//       orderAddress: orderData.orderAddress,
//       paymentMethod: orderData.paymentMethod,
//       subTotal: orderData.subTotal,
//       shippingPrice: orderData.shippingPrice,
//       tax: orderData.tax,
//       total: orderData.total,
//       totalBuy: orderData.totalBuy,
//             itemsInOrder:0,
//       // user: orderData.codUse,
//       // id_client: orderData.codCus,
//       // id_config: orderData.codCon,
//       // user: orderData.user,
//       // id_config2: orderData.codCon2,
//       codConNum: orderData.codConNum,
//       // codCom: orderData.codCom,
//       // supplier: orderData.codSup,
//       //////////  numera remito /////////////////
//       // remNum: orderData.remNum,
//       movpvNum: orderData.movpvNum,
//       //////////  numera remito /////////////////
//       // remDat: safeDate(orderData.remDat),
//       movpvDat: safeDate(orderData.movpvDat),
//       dueDat: safeDate(orderData.dueDat),
//       invNum: orderData.invNum,
//       invDat: safeDate(orderData.invDat),
//       recNum: orderData.recNum,
//       recDat: safeDate(orderData.recDat),
//       desVal: orderData.desVal,
//       notes: orderData.notes,
//       salbuy: orderData.salbuy,
// /////////////



//             // relaciones
//             customer: orderData.codCus ? { connect: { id: orderData.codCus } } : undefined,
//             comprobante: orderData.codCom ? { connect: { id: orderData.codCom } } : undefined,
//             configuration: orderData.codCon ? { connect: { id: orderData.codCon } } : undefined,
//             configuration2: orderData.codCon2 ? { connect: { id: orderData.codCon2 } } : undefined,
//             // supplier1: orderData.codSup ? { connect: { id: orderData.codSup } } : undefined,
//             user1: orderData.user ? { connect: { id: orderData.user } } : undefined,


            
//             // order items
//             orderItems: {
//               create: orderItems.map(item => ({
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
//                 instrumentoId: item.instrumentoId,



//               }))
//             }


//           },
//           include: { orderItems: true }, // incluye los items en la respuesta
//         });

//         // return { invoice };
//       const invoiceWithMongoId = {
//         ...invoice,
//         _id: invoice.id,
//       };

//       return { invoice: invoiceWithMongoId };            

//     } catch (error) {
//       this.handleExceptions( error );
//     }

// }

async createMov(createInvoiceDto: any) {

  const { orderItems, orderAddress, ...orderData } = createInvoiceDto;

  const safeDate = (dateStr?: string) => dateStr ? new Date(dateStr) : null;

  try {

    const result = await this.prisma.$transaction(async (tx) => {

      let Numero = 0;

      // =========================
      // 🔢 NUMERADOR MOVIMIENTO
      // =========================
      if (orderData.movpvNum > 0) {
        Numero = orderData.movpvNum;
      } else {

        const config = await tx.configuration.update({
          where: { id: orderData.codCon },
          data: {
            numIntMov: { increment: 1 },
          },
        });

        Numero = config.numIntMov;
      }

      orderData.movpvNum = Numero;

      // =========================
      // 🧾 CREAR MOVIMIENTO
      // =========================
      const invoice = await tx.order.create({
        data: {

          orderAddress: orderData.orderAddress,
          paymentMethod: orderData.paymentMethod,
          subTotal: orderData.subTotal,
          shippingPrice: orderData.shippingPrice,
          tax: orderData.tax,
          total: orderData.total,
          totalBuy: orderData.totalBuy,
          itemsInOrder: 0,

          codConNum: orderData.codConNum,

          movpvNum: orderData.movpvNum,
          movpvDat: safeDate(orderData.movpvDat),

          dueDat: safeDate(orderData.dueDat),

          invNum: orderData.invNum,
          invDat: safeDate(orderData.invDat),

          recNum: orderData.recNum,
          recDat: safeDate(orderData.recDat),

          desVal: orderData.desVal,
          notes: orderData.notes,
          salbuy: orderData.salbuy,

          // relaciones
          customer: orderData.codCus
            ? { connect: { id: orderData.codCus } }
            : undefined,

          comprobante: orderData.codCom
            ? { connect: { id: orderData.codCom } }
            : undefined,

          configuration: orderData.codCon
            ? { connect: { id: orderData.codCon } }
            : undefined,

          configuration2: orderData.codCon2
            ? { connect: { id: orderData.codCon2 } }
            : undefined,

          user1: orderData.user
            ? { connect: { id: orderData.user } }
            : undefined,

          // items
          orderItems: {
            create: orderItems.map(item => ({
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
              instrumentoId: item.instrumentoId,
            }))
          }

        },
        include: { orderItems: true },
      });

      return invoice;
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

  async searchinvS(query: any) {
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  comprobante,
  usuario,
  customer,
  product,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const comprobanteFilter =
      comprobante && comprobante !== 'all'
        ? {
          codCom: comprobante
          }
        : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    // // --- Observaciones (LIKE en Postgres) ---
    // const obserFilter =
    //   obser && obser !== 'all'
    //     ? {
    //         OR: [
    //           { notes: { contains: obser, mode: 'insensitive' } },
    //           { orderItems: { some: { observ: { contains: obser, mode: 'insensitive' } } } },
    //         ],
    //       }
    //     : {};

const obserFilter: Prisma.OrderWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            orderItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const existeIns =
          { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { invDat: 'desc' as const }
      : { invDat: 'asc' as const };


///////query

    const orders = await this.prisma.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...customerFilter,
        ...comprobanteFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        // ...existeIns,
        salbuy: 'SALE', invNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        comprobante: true, 
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
      },      })

  const invoices = orders.map((order) => ({
    _id: order.id,
    ...order,
    id_client: order.customer
      ? { _id: order.customer.id, nameCus: order.customer.nameCus }
      : null,
    codCom: order.comprobante
      ? { _id: order.comprobante.id, nameCom: order.comprobante.nameCom }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name }
      : null,

    orderItems: order.orderItems.map((item) => ({
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

  return { invoices };}

  async searchinvB(query: any) {
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  comprobante,
  usuario,
  supplier,
  product,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { invDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { invDat: { gte: new Date(fech1) } }
        : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const comprobanteFilter =
      comprobante && comprobante !== 'all'
        ? {
          codCom: comprobante
          }
        : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    // // --- Observaciones (LIKE en Postgres) ---
    // const obserFilter =
    //   obser && obser !== 'all'
    //     ? {
    //         OR: [
    //           { notes: { contains: obser, mode: 'insensitive' } },
    //           { orderItems: { some: { observ: { contains: obser, mode: 'insensitive' } } } },
    //         ],
    //       }
    //     : {};

const obserFilter: Prisma.OrderWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            orderItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const existeIns =
          { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { invDat: 'desc' as const }
      : { invDat: 'asc' as const };


///////query

    const orders = await this.prisma.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...supplierFilter,
        ...comprobanteFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...existeIns,
        salbuy: 'BUY', invNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        supplier1: true,       // id_client
        comprobante: true, 
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
      },      })

  const invoices = orders.map((order) => ({
    _id: order.id,
    ...order,
    supplier: order.supplier
      ? { _id: order.supplier1.id, name: order.supplier1.name }
      : null,
    codCom: order.comprobante
      ? { _id: order.comprobante.id, nameCom: order.comprobante.nameCom }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name }
      : null,

    orderItems: order.orderItems.map((item) => ({
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

  return { invoices };}


  async searchremS(query: any) {
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
  product,
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
    const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    // // --- Observaciones (LIKE en Postgres) ---
    // const obserFilter =
    //   obser && obser !== 'all'
    //     ? {
    //         OR: [
    //           { notes: { contains: obser, mode: 'insensitive' } },
    //           { orderItems: { some: { observ: { contains: obser, mode: 'insensitive' } } } },
    //         ],
    //       }
    //     : {};

const obserFilter: Prisma.OrderWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            orderItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const existeIns =
          { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { remDat: 'desc' as const }
      : { remDat: 'asc' as const };


///////query

    const orders = await this.prisma.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...customerFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...existeIns,
        salbuy: 'SALE', remNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        comprobante: true,       // id_client
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
      },      })

  const invoices = orders.map((order) => ({
    _id: order.id,
    ...order,
    id_client: order.customer
      ? { _id: order.customer.id, nameCus: order.customer.nameCus }
      : null,
    codCom: order.comprobante
      ? { _id: order.comprobante.id, nameCom: order.comprobante.nameCom }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name }
      : null,

    orderItems: order.orderItems.map((item) => ({
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

  return { invoices };}

  async searchOrds(query: any) {
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
  product,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { createdAt: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { createdAt: { gte: new Date(fech1) } }
        : { createdAt: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
    const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    // // --- Observaciones (LIKE en Postgres) ---
    // const obserFilter =
    //   obser && obser !== 'all'
    //     ? {
    //         OR: [
    //           { notes: { contains: obser, mode: 'insensitive' } },
    //           { orderItems: { some: { observ: { contains: obser, mode: 'insensitive' } } } },
    //         ],
    //       }
    //     : {};

const obserFilter: Prisma.OrderWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            orderItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const existeIns =
          { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { createdAt: 'desc' as const }
      : { createdAt: 'asc' as const };


///////query

    const ordersWork = await this.prisma.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...customerFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...existeIns,
        ordYes: 'Y'
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        comprobante: true,       // id_client
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
      },      })

  const orders = ordersWork.map((order) => ({
    _id: order.id,
    ...order,
    id_client: order.customer
      ? { _id: order.customer.id, nameCus: order.customer.nameCus, emailCus: order.customer.emailCus }
      : null,
    codCom: order.comprobante
      ? { _id: order.comprobante.id, nameCom: order.comprobante.nameCom }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name, email: order.user1.email }
      : null,

    orderItems: order.orderItems.map((item) => ({
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

  async searchOrdUS(id: string) {

    // --- Fechas ---
    const usuarioFilter = id && id !== 'all' ? { user: String(id) } : {};




    const existeIns =
          { "id_instru":  null };


///////query

    const ordersWork = await this.prisma.order.findMany({
      where: {
        ...usuarioFilter,
        ...existeIns,
        ordYes: 'Y'
      },

      include: {
        customer: true,       // id_client
        comprobante: true,       // id_client
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
        orderAddress: true,
      },      })

  const orders = ordersWork.map((order) => ({
    _id: order.id,
    ...order,
    id_client: order.customer
      ? { _id: order.customer.id, nameCus: order.customer.nameCus, emailCus: order.customer.emailCus }
      : null,
    codCom: order.comprobante
      ? { _id: order.comprobante.id, nameCom: order.comprobante.nameCom }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name, email: order.user1.email }
      : null,

    orderItems: order.orderItems.map((item) => ({
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
        orderAddress: {
          firstName: order.orderAddress[0].firstName,
          lastName: order.orderAddress[0].lastName,
          address: order.orderAddress[0].address,
          address2: order.orderAddress[0].address2,
          city: order.orderAddress[0].city,
          zip: order.orderAddress[0].postalCode,
          country: order.orderAddress[0].countryId,
          phone: order.orderAddress[0].phone,
    },
  }));

  return orders;}
//////dili

  async searchmovS(query: any) {
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  usuario,
  product,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { movpvDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { movpvDat: { gte: new Date(fech1) } }
        : { movpvDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    // // --- Observaciones (LIKE en Postgres) ---
    // const obserFilter =
    //   obser && obser !== 'all'
    //     ? {
    //         OR: [
    //           { notes: { contains: obser, mode: 'insensitive' } },
    //           { orderItems: { some: { observ: { contains: obser, mode: 'insensitive' } } } },
    //         ],
    //       }
    //     : {};

const obserFilter: Prisma.OrderWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            orderItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};

    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const existeIns =
          { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { movpvDat: 'desc' as const }
      : { movpvDat: 'asc' as const };


///////query

    const orders = await this.prisma.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...existeIns,
        salbuy: 'SALE', movpvNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        configuration: true,  // id_config
        configuration2: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
      },      })

  const invoices = orders.map((order) => ({
    _id: order.id,
    ...order,
    id_client: order.customer
      ? { _id: order.customer.id, nameCus: order.customer.nameCus }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    id_config2: order.configuration2
      ? { _id: order.configuration2.id, name: order.configuration2.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name }
      : null,

    orderItems: order.orderItems.map((item) => ({
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

  return { invoices };}
//////dili

  async searchremB(query: any) {
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  usuario,
  supplier,
  product,
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
    const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
    const supplierFilter = supplier && supplier !== 'all' ? { supplier: String(supplier) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    // // --- Observaciones (LIKE en Postgres) ---
    // const obserFilter =
    //   obser && obser !== 'all'
    //     ? {
    //         OR: [
    //           { notes: { contains: obser, mode: 'insensitive' } },
    //           { orderItems: { some: { observ: { contains: obser, mode: 'insensitive' } } } },
    //         ],
    //       }
    //     : {};

const obserFilter: Prisma.OrderWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            orderItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};


    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const existeIns =
          { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { remDat: 'desc' as const }
      : { remDat: 'asc' as const };


///////query

    const orders = await this.prisma.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...supplierFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...existeIns,
        salbuy: 'BUY', remNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        supplier1: true,      
        comprobante: true,      
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
      },      })

  const invoices = orders.map((order) => ({
    _id: order.id,
    ...order,
    supplier: order.supplier
      ? { _id: order.supplier1.id, name: order.supplier1.name }
      : null,
    codCom: order.comprobante
      ? { _id: order.comprobante.id, nameCom: order.comprobante.nameCom }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name }
      : null,

    orderItems: order.orderItems.map((item) => ({
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

  return { invoices };}
//////dili

  async searchmovB(query: any) {
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  usuario,
  product,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { movpvDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { movpvDat: { gte: new Date(fech1) } }
        : { movpvDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const productFilter = product && product !== 'all' ? { id_product: String(product) } : {};
    const configuracionFilter =
      configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
    const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

    // // --- Observaciones (LIKE en Postgres) ---
    // const obserFilter =
    //   obser && obser !== 'all'
    //     ? {
    //         OR: [
    //           { notes: { contains: obser, mode: 'insensitive' } },
    //           { orderItems: { some: { observ: { contains: obser, mode: 'insensitive' } } } },
    //         ],
    //       }
    //     : {};

const obserFilter: Prisma.OrderWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          {
            orderItems: {
              some: { observ: { contains: obser, mode: 'insensitive' } },
            },
          },
        ],
      }
    : {};

    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const existeIns =
          { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { movpvDat: 'desc' as const }
      : { movpvDat: 'asc' as const };


///////query

    const orders = await this.prisma.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...existeIns,
        salbuy: 'BUY', movpvNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        configuration: true,  // id_config
        configuration2: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        orderItems: true,
      },      })

  const invoices = orders.map((order) => ({
    _id: order.id,
    ...order,
    id_client: order.customer
      ? { _id: order.customer.id, nameCus: order.customer.nameCus }
      : null,
    id_config: order.configuration
      ? { _id: order.configuration.id, name: order.configuration.name }
      : null,
    id_config2: order.configuration2
      ? { _id: order.configuration2.id, name: order.configuration2.name }
      : null,
    user: order.user
      ? { _id: order.user1.id, name: order.user1.name }
      : null,

    orderItems: order.orderItems.map((item) => ({
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

  return { invoices };}
//////dili




  async findAlldil(query: any) {

// Traemos todos los OrderItems con sus Order relacionados
const orderItemsWithOrder = await this.prisma.orderItem.findMany({
  include: {
    order: {
      include: {
        orderAddress: true,
        customer: true,
        parte: true,
        instrumento: true,
        configuration: true,
        user1: true,
      },
    },
  },
});

// Mapeamos cada OrderItem a un objeto tipo invoice
const invoices = orderItemsWithOrder.map(item => ({
  _id: item.id, // ID del item
  orderItems: {
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
  orderAddress: item.order?.orderAddress?.[0] ?? {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    zip: '',
    country: '',
    phone: ''
  },
  paymentMethod: item.order?.paymentMethod ?? '',
  subTotal: item.order?.subTotal ?? 0,
  shippingPrice: item.order?.shippingPrice ?? 0,
  tax: item.order?.tax ?? 0,
  total: item.order?.total ?? 0,
  totalBuy: item.order?.totalBuy ?? 0,
  // id_client: item.order?.id_client ? item.order.id_client : null,
  id_client: item.order?.customer ?? { nameCus: '' },
  // id_instru: item.order?.id_instru ? item.order.id_instru : null,
  id_instru: item.order?.instrumento ?? { name: '' },
  id_parte: item.order?.parte ?? { name: '' },
  libNum: item.order?.libNum ?? 0,
  folNum: item.order?.folNum ?? 0,
  asiNum: item.order?.asiNum ?? 0,
  asiDat: item.order?.asiDat ?? null,
  escNum: item.order?.escNum ?? 0,
  asieNum: item.order?.asieNum ?? 0,
  asieDat: item.order?.asieDat ?? null,
  terminado: item.order?.terminado ?? false,
  // id_config: item.order?.id_config ? item.order.id_config : null,
  id_config: item.order?.configuration ?? { name: '' },
  codConNum: item.order?.codConNum ?? '',
  // user: item.order?.user ? item.order.user : null,
  user: item.order?.user1 ?? { name: '' },
  isPaid: item.order?.isPaid ?? false,
  isDelivered: item.order?.isDelivered ?? false,
  remNum: item.order?.remNum ?? 0,
  remDat: item.order?.remDat ?? null,
  dueDat: item.order?.dueDat ?? null,
  invNum: item.order?.invNum ?? 0,
  invDat: item.order?.invDat ?? null,
  recNum: item.order?.recNum ?? 0,
  recDat: item.order?.recDat ?? null,
  desVal: item.order?.desVal ?? '',
  notes: item.order?.notes ?? '',
  salbuy: item.order?.salbuy ?? '',
  createdAt: item.order?.createdAt ?? new Date(),
  updatedAt: item.order?.updatedAt ?? new Date(),

  // Campos calculados / alias de relaciones
  instruName: item.order?.instrumento?.name ?? '',
  parteName: item.order?.parte?.name ?? '',
  customName: item.order?.customer?.nameCus ?? '',
  configName: item.order?.configuration?.name ?? '',
  userName: item.order?.user1?.name ?? '',
  valor: (item.price * (1 + item.porIva / 100)).toFixed(2),
  totalOrder: item.order?.total?.toFixed(2) ?? '0.00',
  __v: 0,
}));


  return { invoices };

}
//////dili


async findOne(id: string) {
  if (!id) throw new NotFoundException(`Entrada with id "${id}" not found`);

  const invoice = await this.prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,       // id_client
      configuration: true,  // id_config
      instrumento: true,    // id_instru
      parte: true,          // id_parte
      user1: true,          // usuario
      orderItems: true,
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
        nameCus: invoice.customer.nameCus}
      : null,
    id_config: invoice.configuration
      ? { _id: invoice.configuration.id,
         codCon: invoice.configuration.codCon,
         name: invoice.configuration.name }
         : null,
         id_instru: invoice.instrumento
         ? { _id: invoice.instrumento.id,
          codIns: invoice.instrumento.codIns,
          name: invoice.instrumento.name }
          : null,
          id_parte: invoice.parte
          ? { _id: invoice.parte.id,
            codPar: invoice.parte.codPar,
            name: invoice.parte.name }
            : null,
            user: invoice.user1
            ? { _id: invoice.user1.id,
              name: invoice.user1.name }
      : null,
    orderItems: invoice.orderItems.map(item => ({
      _id: item.productId,
      slug: item.slug,
      title: item.title,
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
  return formattedInvoice;
}

async nullinvoice(updateInvoiceDto: any, id: string) {
  // const { _id, ...rest } = updateInvoiceDto;
  // Prepara los datos para Prisma
  // const data: any = {
  //   ...rest,
  // };

  try {
    const updated = await this.prisma.order.update({
      where: { id: id},
      data: {
          remNum : null,
          invNum : null,
          invDat : null,
          recNum : null,
          recDat : null,
          desVal : null,
          notes : null,
          salbuy : null,
      },
    });

    // Devolver _id para compatibilidad con frontend
    return updated;
  } catch (error: any) {
      this.handleExceptions( error );
  }

}
async nullremit(updateInvoiceDto: any, id: string) {
  // const { _id, ...rest } = updateInvoiceDto;
  // Prepara los datos para Prisma
  // const data: any = {
  //   ...rest,
  // };

  try {
    const updated = await this.prisma.order.update({
      where: { id: id},
      data: {
            remNum: null,
            remDat: null,
            },
    });

    // Devolver _id para compatibilidad con frontend
    return updated;
  } catch (error: any) {
      this.handleExceptions( error );
  }

}


async updateS(updateInvoiceDto: any, id: string) {
  // const { _id, ...rest } = updateInvoiceDto;
  // Prepara los datos para Prisma
  // const data: any = {
  //   ...rest,
  // };

  console.log(updateInvoiceDto)
  try {
    const updated = await this.prisma.order.updateMany({
      where: { recNum: updateInvoiceDto.recNum, id_client: updateInvoiceDto.customer },
      data: {
            recNum: 0,
            recDat: null,
            desVal: '',
            },
    });

    // Devolver _id para compatibilidad con frontend
    return updated;
  } catch (error: any) {
      this.handleExceptions( error );
  }

}
async updateB(updateInvoiceDto: any, id: string) {
  // const { _id, ...rest } = updateInvoiceDto;
  // // Prepara los datos para Prisma
  // const data: any = {
  //   ...rest,
  // };

  try {
    const updated = await this.prisma.order.updateMany({
      where: { recNum: updateInvoiceDto.recNum, supplier: updateInvoiceDto.supplier },
      data: {
            recNum: 0,
            recDat: null,
            desVal: '',
            },
    });

    // Devolver _id para compatibilidad con frontend
    return updated;
  } catch (error: any) {
      this.handleExceptions( error );
  }

}


async remove(id: string) {
  try {
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });
    await this.prisma.order.delete({
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
