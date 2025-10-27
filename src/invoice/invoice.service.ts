import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Order, Prisma, Configuration } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { ProductoFacService } from 'src/producto-fac/producto-fac.service';



@Injectable()
export class InvoiceService extends PrismaClient implements OnModuleInit {

  constructor(private readonly configurationsService: ConfigurationsService,
              private readonly productoFacService: ProductoFacService
  ) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

async createInv(createInvoiceDto: any) {
  const {invoiceAux, receiptAux} = createInvoiceDto;
  const { orderItems, shippingAddress } = invoiceAux;
    console.log(invoiceAux)
  const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;


    try {
//////////////inv
    //////////  GENERA RECIBO /////////////////
    let recAux = 0;
    let recNumero = 0;
    let invNumero = 0;
    let remNumero = 0;
    let invrecNum = 0;
    let invrecDat = "";

""    // console.log("recibo")

    // console.log(req.body.receiptAux.recDat)
    // console.log(req.body.receiptAux.desVal)
    // console.log(req.body.receiptAux.receiptItems)
    // console.log("recibo")
  //   if ( receiptAux.recDat !== "" && receiptAux.desVal !== "") {
  //     //////////  numera RECIBO /////////////////
      
  //     if (receiptAux.recNum > 0)
  //       {recNumero = receiptAux.recNum }
  //       else {
  //         const configId = receiptAux.codCon;
  //         const configuracion = await this.configuration.findUnique(
  //         {
  //           where: { id: configId },
  //         }
  //       );

  //         if (configuracion) {
  //           await this.configuration.update(
  //                         {
  //             where: { id: configId },
  //             data: {
  //               numIntRec: { increment: 1 },
  //             },
  //           }

  //           );
  //         }
  //         recNumero = configuracion.numIntRec;
  //       };
  //       //////////  numera RECIBO /////////////////
  
  //   const newReceipt = new Receipt({
  //     receiptItems: req.body.receiptAux.receiptItems.map((x) => ({
  //       ...x,
  //       valuee: x._id,
  //     })),
  //     subTotal: req.body.receiptAux.subTotal,
  //     total: req.body.receiptAux.total,
  //     totalBuy: req.body.receiptAux.totalBuy,
  //     user: req.body.receiptAux.user,
  //     id_client: req.body.receiptAux.codCus,
  //     id_config: req.body.receiptAux.codCon,
  //     codConNum: req.body.receiptAux.codConNum,
  //     supplier: req.body.receiptAux.codSup,
  //     //////////  numera recibo /////////////////
  //     recNum: recNumero,
  //     //////////  numera recibo /////////////////
  //     recDat: req.body.receiptAux.recDat,
  //     desVal: req.body.receiptAux.desVal,
  //     notes: req.body.receiptAux.notes,
  //     salbuy: req.body.receiptAux.salbuy,
  //   });
  //   const receipt = await newReceipt.save();
  //   recAux = receipt.recNum;
  //   console.log(recAux);
  // }else{
  //   recAux = 0;  
  //   recDat = null;
  // }
      //////////  GENERA RECIBO /////////////////
      //////////  MODIFICA STOCK /////////////////
      
    if (invoiceAux.salbuy === "SALE") {
    if (invoiceAux.isHaber) {
      invoiceAux.orderItems.map(async(item) => {
        // const product = await this.product.findById(item._id);
        const product = await this.product.findUnique(
          {
            where: { id: item._id },
          }
        );
        if (product) {
          await this.product.update(
            {
              where: { id: item._id },
              data: {
                inStock: { decrement: item.quantity },
              },
            }
          );
        }else {
          throw new Error('Product no encontrado');
        }

  }
      )

    } else {

      invoiceAux.orderItems.map(async(item) => {
        // const product = await Product.findById(item._id);
        const product = await this.product.findUnique(
          {
            where: { id: item._id },
          }
        );
        if (product) {
          await this.product.update(
            {
              where: { id: item._id },
              data: {
                inStock: { increment: item.quantity },
              },
            }
          );
        }else {
          throw new Error('Product no encontrado');
        }
  }
      )

    }
    } else {

      if (!invoiceAux.isHaber) {
        invoiceAux.orderItems.map(async(item) => {
        // const product = await this.product.findById(item._id);
        const product = await this.product.findUnique(
          {
            where: { id: item._id },
          }
        );

          if (product) {
          await this.product.update(
            {
              where: { id: item._id },
              data: {
                inStock: { decrement: item.quantity },
              },
            }
          );
        }else {
          throw new Error('Product no encontrado');
        }

          
    }
        )
  
      } else {
  
        invoiceAux.orderItems.map(async(item) => {
          // const product = await this.product.findById(item._id);
        const product = await this.product.findUnique(
          {
            where: { id: item._id },
          }
        );


          if (product) {
          await this.product.update(
            {
              where: { id: item._id },
              data: {
                inStock: { increment: item.quantity },
              },
            }
          );
        }else {
          throw new Error('Product no encontrado');
        }
     
    }
        )
  
      }
    }

    

    //////////  MODIFICA STOCK /////////////////
        //////////  numera factura /////////////////
      
      if (invoiceAux.invNum > 0)
        {invNumero = invoiceAux.invNum }
        else {
          const comproId = invoiceAux.codCom;
          // const comprobante = await this.comprobante.findById(comproId);
          const comprobante = await this.comprobante.findUnique(
          {
            where: { id: comproId },
          }
        );
          // if (comprobante) {
          //   comprobante.numInt = comprobante.numInt + 1;
          //   await comprobante.save();
          // }
          
          if (comprobante) {
            await this.comprobante.update(
              {
                where: { id: comproId },
                data: {
                  numInt: { increment: 1 },
                },
              }
              
            );
          }
          invNumero = comprobante.numInt + 1;

        };
        //////////  numera factura /////////////////

        //////////  numera remito /////////////////
        if (invoiceAux.salbuy === "BUY") {
        remNumero = invoiceAux.remNum;
        }else {
        remNumero = 0;          
        if (invoiceAux.geRem) {

          if (invoiceAux.remNum > 0)
            {remNumero = invoiceAux.remNum }
            else {
          const configId = receiptAux.codCon;
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
                numIntRem: { increment: 1 },
              },
            }

            );
          }
              remNumero = configuracion.numIntRem + 1;
            };
        };
      };

          //////////  numera remito /////////////////

        
        if (recAux > 0) {
          invrecNum = recAux;
          invrecDat =  invoiceAux.invDat;
          }else{
            invrecNum = recAux;
            invrecDat =  invoiceAux.recDat;
          };
///***
      const invoice = await this.order.create({
          data: {
            // shippingAddress: invoiceAux.shippingAddress,
            paymentMethod: invoiceAux.paymentMethod,
            subTotal: invoiceAux.subTotal,
            shippingPrice: invoiceAux.shippingPrice,
            tax: invoiceAux.tax,
            total: invoiceAux.total,
            totalBuy: invoiceAux.totalBuy,
            // user: invoiceAux.codUse,
            // id_client: invoiceAux.codCus,
            // id_config: invoiceAux.codCon,
            // user: invoiceAux.user,
            // id_config2: invoiceAux.codCon2,
            codConNum: invoiceAux.codConNum,
            // codCom: invoiceAux.codCom,
            // supplier: invoiceAux.codSup,
            //////////  numera remito /////////////////
            invNum: invNumero,
            remNum: remNumero,
            // movpvNum: invoiceAux.movpvNum,
            //////////  numera remito /////////////////
            remDat: safeDate(invoiceAux.remDat),
            movpvDat: safeDate(invoiceAux.movpvDat),
            dueDat: safeDate(invoiceAux.dueDat),
            // invNum: invoiceAux.invNum,
            invDat: safeDate(invoiceAux.invDat),
            recNum: invoiceAux.recNum,
            recDat: safeDate(invoiceAux.recDat),
            desVal: invoiceAux.desVal,
            notes: invoiceAux.notes,
            salbuy: invoiceAux.salbuy,
/////////////



            // relaciones
            customer: invoiceAux.codCus ? { connect: { id: invoiceAux.codCus } } : undefined,
            supplier1: invoiceAux.codSup ? { connect: { id: invoiceAux.codSup } } : undefined,
            comprobante: invoiceAux.codCom ? { connect: { id: invoiceAux.codCom } } : undefined,
            configuration: invoiceAux.codCon ? { connect: { id: invoiceAux.codCon } } : undefined,
            configuration2: invoiceAux.codCon2 ? { connect: { id: invoiceAux.codCon2 } } : undefined,
            // supplier1: invoiceAux.codSup ? { connect: { id: invoiceAux.codSup } } : undefined,
            user1: invoiceAux.user ? { connect: { id: invoiceAux.user } } : undefined,


            
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
            }
          },
          include: { orderItems: true }, // incluye los items en la respuesta
        });

        // return { invoice };
      const invoiceWithMongoId = {
        ...invoice,
        _id: invoice.id,
      };

      return { invoice: invoiceWithMongoId };            
    } catch (error) {
      this.handleExceptions( error );
    }
      
        ///***
//////////////inv

}

async createRem(createInvoiceDto: any) {
  const { orderItems, shippingAddress, ...orderData } = createInvoiceDto;

  const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
    try {


//////////////
      let remNumero = 0;
      if (orderData.remNum > 0) {
        remNumero = orderData.remNum;
      } else {
        const configId = orderData.codCon;
        // const configuracion = await Configuration.findById(configId).session(session);
        const configuracion = await this.configuration.findUnique(
          {
            where: { id: configId },
          }
        );
        if (configuracion) {
          configuracion.numIntRem += 1;
          // await configuracion.save({ session });
          await this.configuration.update(
            {
              where: { id: configId },
              data: {
                numIntRem: { increment: 1 },
              },
            }
          );
          remNumero = configuracion.numIntRem;
        } else {
          throw new Error('Configuración no encontrada');
        }
      }
      orderData.remNum = remNumero;    
//////////////




            const invoice = await this.order.create({
          data: {
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      subTotal: orderData.subTotal,
      shippingPrice: orderData.shippingPrice,
      tax: orderData.tax,
      total: orderData.total,
      totalBuy: orderData.totalBuy,
      // user: orderData.codUse,
      // id_client: orderData.codCus,
      // id_config: orderData.codCon,
      // user: orderData.user,
      // id_config2: orderData.codCon2,
      movpvNum: orderData.movpvNum,
      movpvDat: safeDate(orderData.movpvDat),
      codConNum: orderData.codConNum,
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
      salbuy: orderData.salbuy,
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
            }
          },
          include: { orderItems: true }, // incluye los items en la respuesta
        });

        // return { invoice };
      const invoiceWithMongoId = {
        ...invoice,
        _id: invoice.id,
      };

      return { invoice: invoiceWithMongoId };            

    } catch (error) {
      this.handleExceptions( error );
    }

}


async createMov(createInvoiceDto: any) {
  const { orderItems, shippingAddress, ...orderData } = createInvoiceDto;

  const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
    try {


//////////////
      let Numero = 0;
      if (orderData.movpvNum > 0) {
        Numero = orderData.movpvNum;
      } else {
        const configId = orderData.codCon;
        // const configuracion = await Configuration.findById(configId).session(session);
        const configuracion = await this.configuration.findUnique(
          {
            where: { id: configId },
          }
        );
        if (configuracion) {
          configuracion.numIntMov += 1;
          // await configuracion.save({ session });
          await this.configuration.update(
            {
              where: { id: configId },
              data: {
                numIntMov: { increment: 1 },
              },
            }
          );
          Numero = configuracion.numIntMov;
        } else {
          throw new Error('Configuración no encontrada');
        }
      }
      orderData.movpvNum = Numero;    
//////////////




            const invoice = await this.order.create({
          data: {
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      subTotal: orderData.subTotal,
      shippingPrice: orderData.shippingPrice,
      tax: orderData.tax,
      total: orderData.total,
      totalBuy: orderData.totalBuy,
      // user: orderData.codUse,
      // id_client: orderData.codCus,
      // id_config: orderData.codCon,
      // user: orderData.user,
      // id_config2: orderData.codCon2,
      codConNum: orderData.codConNum,
      // codCom: orderData.codCom,
      // supplier: orderData.codSup,
      //////////  numera remito /////////////////
      // remNum: orderData.remNum,
      movpvNum: orderData.movpvNum,
      //////////  numera remito /////////////////
      // remDat: safeDate(orderData.remDat),
      movpvDat: safeDate(orderData.movpvDat),
      dueDat: safeDate(orderData.dueDat),
      invNum: orderData.invNum,
      invDat: safeDate(orderData.invDat),
      recNum: orderData.recNum,
      recDat: safeDate(orderData.recDat),
      desVal: orderData.desVal,
      notes: orderData.notes,
      salbuy: orderData.salbuy,
/////////////



            // relaciones
            customer: orderData.codCus ? { connect: { id: orderData.codCus } } : undefined,
            comprobante: orderData.codCom ? { connect: { id: orderData.codCom } } : undefined,
            configuration: orderData.codCon ? { connect: { id: orderData.codCon } } : undefined,
            configuration2: orderData.codCon2 ? { connect: { id: orderData.codCon2 } } : undefined,
            // supplier1: orderData.codSup ? { connect: { id: orderData.codSup } } : undefined,
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
            }
          },
          include: { orderItems: true }, // incluye los items en la respuesta
        });

        // return { invoice };
      const invoiceWithMongoId = {
        ...invoice,
        _id: invoice.id,
      };

      return { invoice: invoiceWithMongoId };            

    } catch (error) {
      this.handleExceptions( error );
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

    const orders = await this.order.findMany({
      where: {
        ...fechasFilter,
        ...productFilter,
        ...customerFilter,
        ...comprobanteFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...existeIns,
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

    const orders = await this.order.findMany({
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

    const orders = await this.order.findMany({
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

    const orders = await this.order.findMany({
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

    const orders = await this.order.findMany({
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

    const orders = await this.order.findMany({
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
const orderItemsWithOrder = await this.orderItem.findMany({
  include: {
    order: {
      include: {
        shippingAddress: true,
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
  shippingAddress: item.order?.shippingAddress?.[0] ?? {
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

  const invoice = await this.order.findUnique({
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






async remove(id: string) {
  try {
    await this.orderItem.deleteMany({
      where: { orderId: id },
    });
    await this.order.delete({
      where: { id },
    });
    return { message: `Remito con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`Remito con id "${id}" no encontrado`);
    }
    throw error; // otros errores
  }
}

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Order exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Order - Check server logs`);
  }




}
