import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Receipt, Prisma, Configuration } from '@prisma/client';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';
// seria valuee import { ProductoFacService } from 'src/producto-fac/producto-fac.service';


@Injectable()
export class ReceiptService extends PrismaClient implements OnModuleInit {

  constructor(private readonly configurationsService: ConfigurationsService,
  ) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

  async create(createReceiptDto: any) {


  const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
    try {


//////////////
      let recNumero = 0;
      if (createReceiptDto.remNum > 0) {
        recNumero = createReceiptDto.remNum;
      } else {
        const configId = createReceiptDto.codCon;
        // const configuracion = await Configuration.findById(configId).session(session);
        const configuracion = await this.configuration.findUnique(
          {
            where: { id: configId },
          }
        );
        if (configuracion) {
          await this.configuration.update(
            {
              where: { id: configId },
              data: {
                numIntRec: { increment: 1 },
              },
            }
          );
          recNumero = configuracion.numIntRec += 1;
        } else {
          throw new Error('Configuración no encontrada');
        }
      }
//////////////

      const receipt = await this.receipt.create({
          data: {
      subTotal: createReceiptDto.subTotal,
      total: createReceiptDto.total,
      totalBuy: createReceiptDto.totalBuy,
      // user: createReceiptDto.codUse,
      // id_client: createReceiptDto.codCus,
      // id_config: createReceiptDto.codCon,
      // user: createReceiptDto.user,
      // id_config2: createReceiptDto.codCon2,
      codConNum: +createReceiptDto.codConNum,
      // codCom: createReceiptDto.codCom,
      // supplier: createReceiptDto.codSup,
      //////////  numera remito /////////////////
      recNum: recNumero,
      //////////  numera remito /////////////////
      recDat: safeDate(createReceiptDto.recDat),
      desval: createReceiptDto.receiptItems[0].desval,
      notes: createReceiptDto.notes,
      salbuy: createReceiptDto.salbuy,
/////////////



            // relaciones
            customer: createReceiptDto.codCus ? { connect: { id: createReceiptDto.codCus } } : undefined,
            configuration: createReceiptDto.codCon ? { connect: { id: createReceiptDto.codCon } } : undefined,
            supplier1: createReceiptDto.codSup ? { connect: { id: createReceiptDto.codSup } } : undefined,
            user1: createReceiptDto.user ? { connect: { id: createReceiptDto.user } } : undefined,


            
            // order items
            receiptItems: {
              create: createReceiptDto.receiptItems.map(item => ({
                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                // venDat: safeDate(item.venDat),
                // productId: item.productId,
                valuee: item._id,
              }))
            }
          },
          include: { receiptItems: true }, // incluye los items en la respuesta
        });

        // return { invoice };
      const invoiceWithMongoId = {
        ...receipt,
        _id: receipt.id,
      };

      return { receipt: invoiceWithMongoId };            

    } catch (error) {
      this.handleExceptions( error );
    }

  }

  async createCaj(createReceiptDto: any) {


  const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
    try {


//////////////
      let cajNumero = 0;
      if (createReceiptDto.cajNum > 0) {
        cajNumero = createReceiptDto.cajNum;
      } else {
        const configId = createReceiptDto.codCon;
        // const configuracion = await Configuration.findById(configId).session(session);
        const configuracion = await this.configuration.findUnique(
          {
            where: { id: configId },
          }
        );
        if (configuracion) {
          await this.configuration.update(
            {
              where: { id: configId },
              data: {
                numIntCaj: { increment: 1 },
              },
            }
          );
          cajNumero = configuracion.numIntCaj += 1;
        } else {
          throw new Error('Configuración no encontrada');
        }
      }
//////////////

      const receipt = await this.receipt.create({
          data: {
      subTotal: createReceiptDto.subTotal,
      total: createReceiptDto.total,
      totalBuy: createReceiptDto.totalBuy,
      // user: createReceiptDto.codUse,
      // id_client: createReceiptDto.codCus,
      // id_config: createReceiptDto.codCon,
      // user: createReceiptDto.user,
      // id_config2: createReceiptDto.codCon2,
      codConNum: +createReceiptDto.codConNum,
      // codCom: createReceiptDto.codCom,
      // supplier: createReceiptDto.codSup,
      //////////  numera remito /////////////////
      cajNum: cajNumero,
      //////////  numera remito /////////////////
      cajDat: safeDate(createReceiptDto.cajDat),
      desval: createReceiptDto.receiptItems[0].desval,
      notes: createReceiptDto.notes,
      salbuy: createReceiptDto.salbuy,
/////////////



            // relaciones
            encargado: createReceiptDto.codEnc ? { connect: { id: createReceiptDto.codEnc } } : undefined,
            configuration: createReceiptDto.codCon ? { connect: { id: createReceiptDto.codCon } } : undefined,
            supplier1: createReceiptDto.codSup ? { connect: { id: createReceiptDto.codSup } } : undefined,
            user1: createReceiptDto.user ? { connect: { id: createReceiptDto.user } } : undefined,


            
            // order items
            receiptItems: {
              create: createReceiptDto.receiptItems.map(item => ({
                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                // venDat: safeDate(item.venDat),
                // productId: item.productId,
                valuee: item._id,
              }))
            }
          },
          include: { receiptItems: true }, // incluye los items en la respuesta
        });

        // return { invoice };
      const invoiceWithMongoId = {
        ...receipt,
        _id: receipt.id,
      };

      return { receipt: invoiceWithMongoId };            

    } catch (error) {
      this.handleExceptions( error );
    }

  }

  async searchcajS(query: any) {
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  usuario,
  encargado,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { cajDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { cajDat: { gte: new Date(fech1) } }
        : { cajDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
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

const obserFilter: Prisma.ReceiptWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          // {
          //   receiptItems: {
          //     some: { observ: { contains: obser, mode: 'insensitive' } },
          //   },
          // },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    // const existeIns =
    //       { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { cajDat: 'desc' as const }
      : { cajDat: 'asc' as const };


///////query

    const receiptsAll = await this.receipt.findMany({
      where: {
        ...fechasFilter,
        ...encargadoFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        // ...existeIns,
        salbuy: 'SALE', cajNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        encargado: true,      
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        receiptItems: true,
      },      })

  const receipts = receiptsAll.map((receipt) => ({
    _id: receipt.id,
    ...receipt,
    id_encarg: receipt.encargado
      ? { _id: receipt.encargado.id, name: receipt.encargado.name }
      : null,
    id_config: receipt.configuration
      ? { _id: receipt.configuration.id, name: receipt.configuration.name }
      : null,
    user: receipt.user
      ? { _id: receipt.user1.id, name: receipt.user1.name }
      : null,

    receiptItems: receipt.receiptItems.map((item) => ({

                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                valuee: item.id,


    })),
  }));

  return { receipts };}  
  async searchcajB(query: any) {
  // isAuth,
  // // isAdmin,
///////query
const {
  order,
  fech1,
  fech2,
  configuracion,
  usuario,
  encargado,
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { cajDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { cajDat: { gte: new Date(fech1) } }
        : { cajDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
    const encargadoFilter = encargado && encargado !== 'all' ? { id_encarg: String(encargado) } : {};
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

const obserFilter: Prisma.ReceiptWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          // {
          //   receiptItems: {
          //     some: { observ: { contains: obser, mode: 'insensitive' } },
          //   },
          // },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    // const existeIns =
    //       { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { cajDat: 'desc' as const }
      : { cajDat: 'asc' as const };


///////query

    const receiptsAll = await this.receipt.findMany({
      where: {
        ...fechasFilter,
        ...encargadoFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        // ...existeIns,
        salbuy: 'BUY', cajNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        encargado: true,      
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        receiptItems: true,
      },      })

  const receipts = receiptsAll.map((receipt) => ({
    _id: receipt.id,
    ...receipt,
    id_encarg: receipt.encargado
      ? { _id: receipt.encargado.id, name: receipt.encargado.name }
      : null,
    id_config: receipt.configuration
      ? { _id: receipt.configuration.id, name: receipt.configuration.name }
      : null,
    user: receipt.user
      ? { _id: receipt.user1.id, name: receipt.user1.name }
      : null,

    receiptItems: receipt.receiptItems.map((item) => ({

                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                valuee: item.id,


    })),
  }));

  return { receipts };}  

  async searchrecS(query: any) {
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
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
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

const obserFilter: Prisma.ReceiptWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          // {
          //   receiptItems: {
          //     some: { observ: { contains: obser, mode: 'insensitive' } },
          //   },
          // },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    // const existeIns =
    //       { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { recDat: 'desc' as const }
      : { recDat: 'asc' as const };


///////query

    const receiptsAll = await this.receipt.findMany({
      where: {
        ...fechasFilter,
        ...customerFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        // ...existeIns,
        salbuy: 'SALE', recNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        receiptItems: true,
      },      })

  const receipts = receiptsAll.map((receipt) => ({
    _id: receipt.id,
    ...receipt,
    id_client: receipt.customer
      ? { _id: receipt.customer.id, nameCus: receipt.customer.nameCus }
      : null,
    id_config: receipt.configuration
      ? { _id: receipt.configuration.id, name: receipt.configuration.name }
      : null,
    user: receipt.user
      ? { _id: receipt.user1.id, name: receipt.user1.name }
      : null,

    receiptItems: receipt.receiptItems.map((item) => ({

                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                valuee: item.id,


    })),
  }));

  return { receipts };}

  async searchrecB(query: any) {
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
  obser,
} = query;

    // --- Fechas ---
    const fechasFilter =
      !fech1 && !fech2
        ? {}
        : !fech1 && fech2
        ? { recDat: { lte: new Date(fech2) } }
        : fech1 && !fech2
        ? { recDat: { gte: new Date(fech1) } }
        : { recDat: { gte: new Date(fech1), lte: new Date(fech2) } };

    // --- Otros filtros ---
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

const obserFilter: Prisma.ReceiptWhereInput =
  obser && obser !== 'all'
    ? {
        OR: [
          { notes: { contains: obser, mode: 'insensitive' } },
          // {
          //   receiptItems: {
          //     some: { observ: { contains: obser, mode: 'insensitive' } },
          //   },
          // },
        ],
      }
    : {};



    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    // const existeIns =
    //       { "id_instru":  null };

    const sortOrder = order === 'newest'
      ? { recDat: 'desc' as const }
      : { recDat: 'asc' as const };


///////query

    const receiptsAll = await this.receipt.findMany({
      where: {
        ...fechasFilter,
        ...supplierFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        // ...existeIns,
        salbuy: 'BUY', recNum: {gt : 0}
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        configuration: true,  // id_config
        user1: true,          // usuario si quieres incluirlo
        receiptItems: true,
      },      })

  const receipts = receiptsAll.map((receipt) => ({
    _id: receipt.id,
    ...receipt,
    id_client: receipt.customer
      ? { _id: receipt.customer.id, nameCus: receipt.customer.nameCus }
      : null,
    id_config: receipt.configuration
      ? { _id: receipt.configuration.id, name: receipt.configuration.name }
      : null,
    user: receipt.user
      ? { _id: receipt.user1.id, name: receipt.user1.name }
      : null,

    receiptItems: receipt.receiptItems.map((item) => ({

                desval: item.desval,
                numval: +item.numval,
                amountval: +item.amountval,
                valuee: item.id,


    })),
  }));

  return { receipts };}


  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Order exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Order - Check server logs`);
  }


}
