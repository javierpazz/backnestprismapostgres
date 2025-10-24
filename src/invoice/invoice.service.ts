import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { OnModuleInit } from '@nestjs/common';
import { PrismaClient, Order, Prisma, Configuration } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';



@Injectable()
export class InvoiceService extends PrismaClient implements OnModuleInit {

  constructor(private readonly configurationsService: ConfigurationsService) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

async create(createInvoiceDto: any) {
  const { orderItems, shippingAddress, ...orderData } = createInvoiceDto;

  const safeDate = (dateStr: string | undefined) => dateStr ? new Date(dateStr) : null;
    try {


//////////////
      let remNumero;
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
      id_config2: orderData.codCon2,
      movpvNum: orderData.movpvNum,
      movpvDat: safeDate(orderData.movpvDat),
      codConNum: orderData.codConNum,
      // codCom: orderData.codCom,
      supplier: orderData.codSup,
      //////////  numera remito /////////////////
      remNum: orderData.remNumero,
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
            // instrumento: orderData.codIns ? { connect: { id: orderData.codIns } } : undefined,
            configuration: orderData.codCon ? { connect: { id: orderData.codCon } } : undefined,
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
  product,
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
    const instruFilter = instru && instru !== 'all' ? { id_instru: String(instru) } : {};
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

    // --- Estado ---
    const estadoFilter =
      estado === 'TOD'
        ? {}
        : estado === 'EST'
        ? { terminado: false }
        : estado === 'ET'
        ? { terminado: true }
        : {};

    // --- Registro ---
    const registroFilter =
      registro === 'TOD'
        ? {}
        : registro === 'REGI'
        ? { libNum: { gt: 0 } }
        : registro === 'NREGI'
        ? { libNum: 0 }
        : registro === 'PROT'
        ? { asiNum: { gt: 0 } }
        : registro === 'NPROT'
        ? { asiNum: 0 }
        : {};

    // --- Orden ---
    // const sortOrder = order === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const sortOrder = order === 'newest'
      ? { remDat: 'desc' as const }
      : { remDat: 'asc' as const };


///////query

    const orders = await this.order.findMany({
      where: {
        ...fechasFilter,
        ...parteFilter,
        ...instruFilter,
        ...productFilter,
        ...customerFilter,
        ...configuracionFilter,
        ...usuarioFilter,
        ...obserFilter,
        ...estadoFilter,
        ...registroFilter,
      },
        orderBy: sortOrder,


      include: {
        customer: true,       // id_client
        configuration: true,  // id_config
        instrumento: true,    // id_instru
        parte: true,          // id_parte si aplica
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
    id_instru: order.instrumento
      ? { _id: order.instrumento.id, name: order.instrumento.name }
      : null,
    id_parte: order.parte
      ? { _id: order.parte.id, name: order.parte.name }
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
    return { message: `Order con id ${id} eliminado` };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new BadRequestException(`Order con id "${id}" no encontrado`);
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
