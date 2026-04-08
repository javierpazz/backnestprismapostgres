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
        serNum: 'encargado1@serNum.com',
      },
      {
        codMaq: '2',
        name: 'MAQUINA 2',
        serNum: 'encargado2@serNum.com',
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
        name: 'ESCRITURA',
        publico: true,
      },
      {
        codIns: '2',
        name: 'BOLETO',
        publico: true,
      },
      {
        codIns: '3',
        name: 'CERTIFICACION',
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
        name: '1.-EN PROCESO',
        note: '1.-EN PROCESO',
        },
      {
        name: '2.-PARA DISTRIBUCION',
        note: '2.-PARA DISTRIBUCION',
        },
      {
        name: '3.-EN DISTRIBUCION',
        note: '3.-EN DISTRIBUCION',
        },
      {
        name: '4.-ENTREGADA',
        note: '4.-ENTREGADA',
        },
    ],



  configurations: [
      {
        codCon: '0001',
        name: 'Escribana Maria Pia Stutz',
        domcomer: 'DIRECCION Maria Pia Stutz',
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
        name: 'Escribana Nanni Felisa',
        domcomer: 'DIRECCION Nanni Felisa',
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
      description: "Descripcion Diligencia 1",
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
      slug: "DILIGENCIA1_??",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'dil' ],
      title: "DILIGENCIA1 ???",
      gender: 'men'
    },
    {
      codPro : "2",
      codigoPro : "2",
      medPro : "UNIDAD",
      description: "Descripcion Diligencia 2",
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
      slug: "DILIGENCIA2_??",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'dil' ],
      title: "DILIGENCIA2 ???",
      gender: 'men'
    },

    {
      codPro : "3",
      codigoPro : "3",
      medPro : "UNIDAD",
      description: "Descripcion Diligencia 3",
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
      slug: "DILIGENCIA3_??",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'dil' ],
      title: "DILIGENCIA3 ???",
      gender: 'men'
    },

    {
      codPro : "4",
      codigoPro : "4",
      medPro : "UNIDAD",
      description: "Descripcion Diligencia 4",
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
      slug: "DILIGENCIA4_??",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'dil' ],
      title: "DILIGENCIA4 ???",
      gender: 'men'
    },
    {
      codPro : "5",
      codigoPro : "5",
      medPro : "UNIDAD",
      description: "Descripcion Diligencia 5",
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
      slug: "DILIGENCIA5_??",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'dil' ],
      title: "DILIGENCIA5 ???",
      gender: 'men'
    },
    {
      codPro : "6",
      codigoPro : "6",
      medPro : "UNIDAD",
      description: "Descripcion Diligencia 6",
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
      slug: "DILIGENCIA6_??",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'dil' ],
      title: "DILIGENCIA6 ???",
      gender: 'men'
    },
    {
      codPro : "7",
      codigoPro : "7",
      medPro : "UNIDAD",
      description: "Descripcion Diligencia 7",
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
      slug: "DILIGENCIA7_??",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'dil' ],
      title: "DILIGENCIA7 ???",
      gender: 'men'
    },

  ]
};