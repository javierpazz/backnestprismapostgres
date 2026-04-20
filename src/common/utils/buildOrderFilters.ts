import { Prisma } from '@prisma/client';

export const buildOrderFilters = (query: any) => {

  const {
    fech1,
    fech2,
    configuracion,
    comprobante,
    usuario,
    customer,
    producto,
    encargado,
    obser,
    order,
  } = query;

  // ========================
  // 📅 FECHAS (invDat)
  // ========================
  const fechas: Prisma.OrderWhereInput =
    !fech1 && !fech2
      ? {}
      : !fech1 && fech2
      ? { invDat: { lte: new Date(fech2) } }
      : fech1 && !fech2
      ? { invDat: { gte: new Date(fech1) } }
      : { invDat: { gte: new Date(fech1), lte: new Date(fech2) } };

  // ========================
  // 🔹 BÁSICOS
  // ========================
  const customerFilter =
    customer && customer !== 'all'
      ? { id_client: String(customer) }
      : {};

  const configuracionFilter =
    configuracion && configuracion !== 'all'
      ? { id_config: String(configuracion) }
      : {};

  const usuarioFilter =
    usuario && usuario !== 'all'
      ? { user: String(usuario) }
      : {};

  const encargadoFilter =
    encargado && encargado !== 'all'
      ? { id_encar: String(encargado) }
      : {};

  const comprobanteFilter =
    comprobante && comprobante !== 'all'
      ? { codCom: comprobante }
      : {};

  // ========================
  // 📦 PRODUCTO (OrderItems)
  // ========================
  const productoFilter: Prisma.OrderWhereInput =
    producto && producto !== 'all'
      ? {
          orderItems: {
            some: {
              productId: String(producto),
            },
          },
        }
      : {};

  // ========================
  // 🔍 OBSERVACIONES
  // ========================
  const obserFilter: Prisma.OrderWhereInput =
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
              orderItems: {
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

  // ========================
  // 🔃 ORDEN
  // ========================
  const sortOrder: Prisma.OrderOrderByWithRelationInput =
    order === 'newest'
      ? { invDat: 'desc' }
      : { invDat: 'asc' };

  // ========================
  // 🧱 BASE WHERE
  // ========================
  const baseOrderWhere: Prisma.OrderWhereInput = {
    ...fechas,
    ...customerFilter,
    ...configuracionFilter,
    ...usuarioFilter,
    ...encargadoFilter,
    ...comprobanteFilter,
    ...productoFilter,
    ...obserFilter,

    // 🔥 reglas fijas de invoices
    salbuy: 'SALE',
    invNum: { gt: 0 },
  };

  return {
    baseOrderWhere,
    fechas,
    productoFilter,
    customerFilter,
    configuracionFilter,
    usuarioFilter,
    encargadoFilter,
    comprobanteFilter,
    obserFilter,
    sortOrder,
  };
};