import { Prisma } from '@prisma/client';

export const buildFilters = (query: any) => {
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
  // FECHAS
  // ========================
  const fechas =
    !fech1 && !fech2
      ? {}
      : !fech1 && fech2
      ? { remDat: { lte: new Date(fech2) } }
      : fech1 && !fech2
      ? { remDat: { gte: new Date(fech1) } }
      : { remDat: { gte: new Date(fech1), lte: new Date(fech2) } };

  // ========================
  // BÁSICOS
  // ========================
  const parteFilter = parte && parte !== 'all' ? { id_parte: String(parte) } : {};
  const maquinaFilter = maquina && maquina !== 'all' ? { id_maquin: String(maquina) } : {};
  const encargadoFilter = encargado && encargado !== 'all' ? { id_encar: String(encargado) } : {};
  const instruFilter = instru && instru !== 'all' ? { id_instru: String(instru) } : {};
  const customerFilter = customer && customer !== 'all' ? { id_client: String(customer) } : {};
  const configuracionFilter =
    configuracion && configuracion !== 'all' ? { id_config: String(configuracion) } : {};
  const usuarioFilter = usuario && usuario !== 'all' ? { user: String(usuario) } : {};

  // ========================
  // ESTADO
  // ========================
  const estadoFilter: Prisma.ServiceWhereInput =
    estado === 'EST'
      ? { terminado: false }
      : estado === 'ET'
      ? { terminado: true }
      : {};

  const estadoServiceItemFilter: Prisma.ServiceItemWhereInput =
    estado === 'EST'
      ? { terminado: false }
      : estado === 'ET'
      ? { terminado: true }
      : {};

  // ========================
  // REGISTRO
  // ========================
  const registroFilter: Prisma.ServiceWhereInput =
    registro === 'REGI'
      ? { libNum: { gt: 0 } }
      : registro === 'NREGI'
      ? { OR: [{ libNum: { lt: 1 } }, { libNum: null }] }
      : registro === 'PROT'
      ? { asiNum: { gt: 0 } }
      : registro === 'NPROT'
      ? { OR: [{ asiNum: { lt: 1 } }, { asiNum: null }] }
      : {};

  // ========================
  // OBSERVACIONES
  // ========================
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

  // ========================
  // PRODUCTO
  // ========================
//   const productoFilter =
//     producto && producto !== 'all'
//       ? { productId: String(producto) }
//       : {};
    const productoFilter: Prisma.ServiceItemWhereInput = {
    ...(producto && producto !== 'all'
        ? { productId: String(producto) }
        : {}),
    };
  const productoServiceItemFilter: Prisma.ServiceWhereInput =
    producto && producto !== 'all'
      ? {
          serviceItems: {
            some: {
              productId: String(producto),
            },
          },
        }
      : {};

  // ========================
  // BASE SERVICE WHERE
  // ========================
  const baseServiceWhere: Prisma.ServiceWhereInput = {
    id_instru: { not: null },
    ...fechas,
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
    ...productoServiceItemFilter,
  };

  return {
    baseServiceWhere,
    productoFilter,
    parteFilter,
    maquinaFilter,
    encargadoFilter,
    instruFilter,
    customerFilter,
    configuracionFilter,
    usuarioFilter,
    fechas,
    estadoFilter,
    estadoServiceItemFilter
  };
};