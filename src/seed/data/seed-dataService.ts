import * as bcrypt from 'bcrypt';


export interface SeedComprobante {
    codComC: string;
    // codComt: string;
    nameCom: string;
    claCom: string;
    isHaber: boolean;
    isAjuste: boolean;
    noDisc: boolean;
    toDisc: boolean;
    itDisc: boolean;
    interno: boolean;
    numInt: number;
    // codCon: string;

}


interface SeedEstado {
    // _id: string;
    name: string;
    note: string;
}

interface SeedValuee {
    // _id: string;
    codVal: string;
    desVal: string;
}

interface SeedParte {
    // _id: string;
    codPar: string;
    // codPart: string;
    name: string;
    email: string;
    domcomer: string;
    cuit: string;
    coniva: string;
}


interface SeedInstrumento {
    // _id: string;
    codIns: string;
    name: string;
    publico     : boolean;

}


interface SeedCustomer {
    // _id: string;
    codCus: string;
    // codCust: string;
    nameCus: string;
    emailCus: string;
    domcomer: string;
    cuit: string;
    coniva: string;
}

interface SeedEncargado {
    codEnc: string;
    name: string;
    email: string;
}
interface SeedMaquina {
    codMaq: string;
    name: string;
    serNum: string;
}

interface SeedSupplier {
    // _id: string;
    codSup: string;
    // codSupt: string;
    name: string;
    email: string;
    domcomer: string;
    cuit: string;
    coniva: string;


}

interface SeedProduct {
  codPro: string;
  codigoPro: string;
  medPro: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  priceBuy: number;
  porIva: number;
  sizes: ValidSizes[];
  slug: string;
  brand: string;
  tags: string[];
  title: string;
  category: string;
  type: ValidTypes;
  gender: 'men' | 'women' | 'kid' | 'unisex';
}



interface SeedConfigurations {
codCon:      string;
name:      string;
domcomer:      string;
cuit:      string;
coniva:      string;
ib:      string;
feciniact:       string;
numIntRem:       number;
numIntRec:       number;
numIntOdp:       number;
numIntCaj:       number;
numIntMov:       number;
numIntCli:       number;
}

interface SeedUser {
  email: string;
  password: string;
  name: string;
  // role: 'admin'|'user'|'client'
  role: string;
  resetToken: string;
}



type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
type ValidTypes = 'shirts' | 'pants' | 'hoodies' | 'hats';

interface SeedData {
  comprobantes: SeedComprobante[];
  estados: SeedEstado[];
  partes: SeedParte[];
  valuees: SeedValuee[];
  instrumentos: SeedInstrumento[];
  customers: SeedCustomer[];
  encargados: SeedEncargado[];
  maquinas: SeedMaquina[];
  suppliers: SeedSupplier[];
  configurations: SeedConfigurations[];
  users: SeedUser[];
  categories: string[];
  products: SeedProduct[];
}


export const initialData: SeedData = {

  valuees: [
    {
    codVal: '1',
    desVal: '$ EFECTIVO',
    },
    {
    codVal: '2',
    desVal: 'CHEQUE',
    },
    {
    codVal: '3',
    desVal: 'TARJETA',
    },
    ],

      comprobantes: [
        {
        codComC: '1',
        nameCom: 'FACTURA A',
        claCom: '1',
        isHaber: false,
        isAjuste: false,
        noDisc: false,
        toDisc: true,
        itDisc: false,
        interno: false,
        numInt: 0,
      },
      {
        codComC: '2',
        nameCom: 'FACTURA B',
        claCom: '2',
        isHaber: false,
        isAjuste: false,
        noDisc: false,
        toDisc: false,
        itDisc: true,
        interno: false,
        numInt: 0,
      },
      {
        codComC: '3',
        nameCom: 'FACTURA C',
        claCom: '3',
        isHaber: false,
        isAjuste: false,
        noDisc: true,
        toDisc: false,
        itDisc: false,
        interno: false,
        numInt: 0,
      },
      {
        codComC: '4',
        nameCom: 'COMP NO FISCAL',
        claCom: '4',
        isHaber: false,
        isAjuste: false,
        noDisc: true,
        toDisc: false,
        itDisc: false,
        interno: true,
        numInt: 0,
          },
      {
        codComC: '5',
        nameCom: 'NOTA DEBITO',
        claCom: '4',
        isHaber: false,
        isAjuste: true,
        noDisc: true,
        toDisc: false,
        itDisc: false,
        interno: true,
        numInt: 0,
          },
      {
        codComC: '6',
        nameCom: 'NOTA CREDITO',
        claCom: '4',
        isHaber: true,
        isAjuste: true,
        noDisc: true,
        toDisc: false,
        itDisc: false,
        interno: true,
        numInt: 0,
          },
        {
        codComC: '1',
        nameCom: 'FACTURA A',
        claCom: '1',
        isHaber: false,
        isAjuste: false,
        noDisc: false,
        toDisc: true,
        itDisc: false,
        interno: false,
        numInt: 0,
      },
      {
        codComC: '2',
        nameCom: 'FACTURA B',
        claCom: '2',
        isHaber: false,
        isAjuste: false,
        noDisc: false,
        toDisc: false,
        itDisc: true,
        interno: false,
        numInt: 0,
      },
      {
        codComC: '3',
        nameCom: 'FACTURA C',
        claCom: '3',
        isHaber: false,
        isAjuste: false,
        noDisc: true,
        toDisc: false,
        itDisc: false,
        interno: false,
        numInt: 0,
      },
      {
        codComC: '4',
        nameCom: 'COMP NO FISCAL',
        claCom: '4',
        isHaber: false,
        isAjuste: false,
        noDisc: true,
        toDisc: false,
        itDisc: false,
        interno: true,
        numInt: 0,
          },
          {
            codComC: '5',
            nameCom: 'NOTA DEBITO',
            claCom: '4',
            isHaber: false,
            isAjuste: true,
            noDisc: true,
            toDisc: false,
            itDisc: false,
            interno: true,
            numInt: 0,
                  },
          {
            codComC: '6',
            nameCom: 'NOTA CREDITO',
            claCom: '4',
            isHaber: true,
            isAjuste: true,
            noDisc: true,
            toDisc: false,
            itDisc: false,
            interno: true,
            numInt: 0,
                  },
            ],


  suppliers: [
        {
        codSup: '1',
        name: 'PROOVEDOR 1',
        email: 'proovedor1@email.com',
        domcomer: 'direccion Prov 1',
        cuit: '20303030303',
        coniva: 'RESP INSC',
      },
        {
        codSup: '2',
        name: 'PROOVEDOR 2',
        email: 'proovedor2@email.com',
        domcomer: 'direccion Prov 2',
        cuit: '30303030303',
        coniva: 'RESP INSC',
        },
    ],
  encargados: [
        {
        codEnc: '1',
        name: 'ENCARGADO 1',
        email: 'encargado1@email.com',
      },
      {
        codEnc: '2',
        name: 'ENCARGADO 2',
        email: 'encargado2@email.com',
        },
    ],
  maquinas: [
        {
        codMaq: '1',
        name: 'MAQUINA 1',
        serNum: 'klwer798ew67f98yf890',
      },
      {
        codMaq: '2',
        name: 'MAQUINA 2',
        serNum: 'klwer798ew67f98yf890',
        },
      {
        codMaq: '3',
        name: 'MAQUINA 3',
        serNum: 'klwer798ew67f98yf890',
        },
    ],

  customers: [
      {
        codCus: '1000000',
        nameCus: 'CLIENTE WEB',
        emailCus: 'client@example.com',
        domcomer: 'DIRECCION CLIENTE WEB ',
        cuit: '20-20202020-2',
        coniva: 'RESP INSCRIPTO',
        },
      {
        codCus: '1',
        nameCus: 'CLIENTE 1',
        emailCus: 'cliente1@email.com',
        domcomer: 'DIRECCION CLIENTE 1 ',
        cuit: '20-20202020-2',
        coniva: 'RESP INSCRIPTO',
        },
        {
          codCus: '2',
          nameCus: 'CLIENTE 2',
          emailCus: 'cliente2@email.com',
          domcomer: 'DIRECCION CLIENTE 2',
          cuit: '20-20202020-2',
          coniva: 'RESP INSCRIPTO',
          },
        {
          codCus: '3',
          nameCus: 'CLIENTE PRUEBA',
          emailCus: 'prueba@example.com',
          domcomer: 'DIRECCION CLIENTE 2',
          cuit: '20-20202020-2',
          coniva: 'RESP INSCRIPTO',
          },
    ],

  instrumentos: [
      {
        codIns: '1',
        name: 'Service Split',
        publico: true,
      },
      {
        codIns: '2',
        name: 'Instalacion Split',
        publico: true,
      },
      {
        codIns: '3',
        name: 'Service Aire Pared',
        publico: true,
      },
      {
        codIns: '4',
        name: 'Instalacion Aire Pared',
        publico: true,
      },
      {
        codIns: '5',
        name: 'Service Filtros Bombas',
        publico: true,
          },
    ],

  partes: [
      {
        codPar: '1',
        name: 'PARTE1',
        email: 'parte1@email.com',
        domcomer: 'DIRECCION PARTE 1 ',
        cuit: '20-20202020-2',
        coniva: 'RESP INSCRIPTO',
        },
        {
          codPar: '2',
          name: 'PARTE2',
          email: 'parte2@email.com',
          domcomer: 'DIRECCION PARTE 2 ',
          cuit: '20-20202020-2',
          coniva: 'RESP INSCRIPTO',
          },
    ],
  estados: [
      {
        name: 'NUEVA',
        note: 'NUEVA',
        },
      {
        name: '1.-EN PLANIFICACION',
        note: '1.-EN PLANIFICACION',
        },

      {
        name: '2.-EN PROCESO',
        note: '2.-EN PROCESO',
        },
      {
        name: '3.-AVACE 20%',
        note: '3.-AVACE 20%',
        },
      {
        name: '4.-AVACE 40%',
        note: '4.-AVACE 40%',
        },
      {
        name: '5.-AVACE 60%',
        note: '5.-AVACE 60%',
        },
      {
        name: '6.-AVACE 80%',
        note: '6.-AVACE 80%',
        },
      {
        name: '7.-TERMINADO',
        note: '7.-TERMINADO',
        },
    ],



  configurations: [
      {
        codCon: '0001',
        name: 'FN Servicios',
        domcomer: 'DIRECCION FN Servicios',
        cuit: '20-20202020-2',
        coniva: 'RESP. INSCRIPTO',
        ib: '87654321',
        feciniact: '12/07/2021',
        numIntRem: 0,
        numIntRec: 0,
        numIntOdp: 0,
        numIntCaj: 0,
        numIntMov: 0,
        numIntCli: 1000000,
      },
      {
        codCon: '0002',
        name: 'FN Servicios 2',
        domcomer: 'DIRECCION FN Servicios 2',
        cuit: '20-20202020-2',
        coniva: 'RESP. INSCRIPTO',
        ib: '87654321',
        feciniact: '12/07/2021',
        numIntRem: 0,
        numIntRec: 0,
        numIntOdp: 0,
        numIntCaj: 0,
        numIntMov: 0,
        numIntCli: 1000000,
      },
      ],

  users: [
    {
      email: 'admin@example.com',
      name: 'Adminisrador',
      password: bcrypt.hashSync("Aa123456", 10),
      role: 'admin',
      resetToken: ''
    },
    {
      email: 'user@example.com',
      name: 'Usuario',
      password: bcrypt.hashSync("Aa123456", 10),
      role: 'user',
      resetToken: ''
    },
    {
      email: 'client@example.com',
      name: 'Cliente',
          password: bcrypt.hashSync("Aa123456", 10),
      role: 'client',
      resetToken: ''
    },


  ],


  categories: [
    'Shirts', 'Pants', 'Hoodies', 'Hats'
  ],
  products: [
    {
      codPro : "1",
      codigoPro : "1",
      medPro : "UNIDAD",
      description: "descripcion Desarmado Equipo",
      images: [
        'imagenblanca1.jpg',
        'imagenblanca2.jpg',
      ],
      inStock: 100000,
      price: 1,
      priceBuy: 1,
      brand:"MARCA",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Desarmado_Equipo",
      type: 'shirts',
      category: 'Service',
      tags: [ 'Tar' ],
      title:  "Desarmado Equipo",
      gender: 'men'
    },
    {
      codPro : "2",
      codigoPro : "2",
      medPro : "UNIDAD",
      description: "descripcion Checkeo Partes Equipo",
      images: [
        'imagenblanca1.jpg',
        'imagenblanca2.jpg',
      ],
      inStock: 100000,
      price: 1,
      priceBuy: 1,
      brand:"MARCA",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Checkeo_Partes_Equipo",
      type: 'shirts',
      category: 'Service',
      tags: [ 'tar' ],
      title: "Checkeo Partes Equipo",
      gender: 'men'
    },

    {
      codPro : "3",
      codigoPro : "3",
      medPro : "UNIDAD",
      description: "descripcion Limpieza equipo",
      images: [
        'imagenblanca1.jpg',
        'imagenblanca2.jpg',
      ],
      inStock: 100000,
      price: 1,
      priceBuy: 1,
      brand:"MARCA",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Limpieza_equipo",
      type: 'shirts',
      category: 'Service',
      tags: [ 'tar' ],
      title: "Limpieza equipo",
      gender: 'men'
    },

    {
      codPro : "4",
      codigoPro : "4",
      medPro : "UNIDAD",
      description: "Descripcion Armado y Prueba de equipo",
      images: [
        'imagenblanca1.jpg',
        'imagenblanca2.jpg',
      ],
      inStock: 100000,
      price: 1,
      priceBuy: 1,
      brand:"MARCA",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Armado_y_Prueba_de_equipo",
      type: 'shirts',
      category: 'Service',
      tags: [ 'tar' ],
      title: "Armado y Prueba de equipo",
      gender: 'men'
    },
    {
      codPro : "5",
      codigoPro : "5",
      medPro : "UNIDAD",
      description: "Descripcion Registro tiempo o Km Uso",
      images: [
        'imagenblanca1.jpg',
        'imagenblanca2.jpg',
      ],
      inStock: 100000,
      price: 1,
      priceBuy: 1,
      brand:"MARCA",
      porIva: 21,
      sizes: [ 'M' ],
      slug:  "Registro_tiempo_o_Km_Uso",
      type: 'shirts',
      category: 'Service',
      tags: [ 'tar' ],
      title: " Registro tiempo o Km Uso",
      gender: 'men'
    },

  ]
};