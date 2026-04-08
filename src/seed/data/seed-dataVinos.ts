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
        name: 'S·T·U·T·Z Wines',
        domcomer: 'DIRECCION S·T·U·T·Z Wines',
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
        name: 'S·T·U·T·Z Wines Punto 2',
        domcomer: 'DIRECCION S·T·U·T·Z Wines',
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
      medPro : "CAJAX6",
      description: "Cosecha a mano en gamelas de 18kg y estiba de 12 meses en botella. 3997 botellas      Estiba en Botella.     De color púrpura profundo, con centro negro, vivo y brillante, reflejando juventud y frescura. Aromas intensos y envolventes de frutas negras maduras como moras y arándanos con notas de cuero, tabaco dulce, y un sutil toque mineral propio de los suelos arenosos de altura.   Entrada potente y estructurada. Taninos firmes pero redondeados, que aportan buen cuerpo y persistencia. Sabores de ciruela negra, regaliz, y una agradable nota de cacao amargo en el final. Equilibrio entre acidez vibrante y alcohol contenido.      Ideal para acompañar carnes asadas, platos con salsas especiadas, o quesos duros de vaca.     Fermentación del Tannat en tanques de acero inoxidable     Espalderos con 20 años de edad promedio.     Chimpa, situada a 7 kilómetros del pueblo, se beneficia de condiciones climáticas excepcionales: baja humedad, vientos diarios y tres horas adicionales de sol respecto a la zona núcleo.",
      images: [
        'tannat.jpg',
        'tannat2.jpg',
      ],
      inStock: 100,
      price: 120960,
      priceBuy: 100000,
      brand:"STUTZ",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Tann_t_Stu_z",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'tinto' ],
      title: "Tannat Stutz",
      gender: 'men'
    },
    {
      codPro : "2",
      codigoPro : "2",
      medPro : "CAJAX6",
      description: "Fermentación lenta en en tanques de acero entre 25 y 30 días con control de tempertura.     4.000 botellas - Cosecha a mano en gamelas de 18kg. evolución en estiba.     Evolución posterior en estiba.     De color amarillo pálido con destellos verdosos. Brillante, vivaz y translúcido, típico de la variedad y del clima seco de altura. Aromas intensos y frescos, se encuentran frutas blancas como pera, durazno y ananá. Notas cítricas de lima y pomelo amarillo. Fondo floral con azahar y jazmín. En Boca entrada sutil y elegante. Buena acidez que aporta frescura y carácter. Final envolvente, persistente y armonioso.     Recomendado para pescados y mariscos, empanadas salteñas, locro, cocina asiática (sushi, curry), platos especiados y picantes.     Parrales a más de 1.700 metros de altitud, clima seco, amplitud térmica y los suelos característicos permiten que esta cepa autóctona despliegue toda su intensidad aromática y frescura natural.     Chimpa, situada a 7 kilómetros del pueblo, se beneficia de condiciones climáticas excepcionales: baja humedad, vientos diarios y tres horas adicionales de sol respecto a la zona núcleo.",
      images: [
                'torrontes.jpg',
                'torrontes2.jpg'
      ],
      inStock: 100,
      price: 105120,
      priceBuy: 100000,
      brand:"STUTZ",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Torr_ntés__tutz",
      type: 'shirts',
      category: 'Blanco',
      tags: [ 'blanco' ],
      title: "Torrontés Stutz",
      gender: 'men'
    },

    {
      codPro : "3",
      codigoPro : "3",
      medPro : "CAJAX6",
      description: "Fermentación lenta en en tanques de acero que se interrumpe en frío, a 5°C, para conservar azúcares naturales y evitar una sobrefermentación     4980 botellas - Cosecha a mano en gamelas de 18kg.     De color Amarillo con destellos plateados y acerados. Límpido, brillante y vivaz. Aromas intensos y seductores. Frutado (ananá, durazno, pera, litchi), floral (flores blancas, azahar, jazmín) y dulzón, notas cítricas frescas que aportan complejidad.   Entrada en boca aterciopelada y dulce. Coincide con su nariz: fruta tropical y floral. Final persistente, fresco y envolvente.     Recomendado para postres como lemon pie, crumble de peras, tarta de frutas. Quesos blandos y azules (brie, camembert, roquefort), frutos secos, cocina asiática especiada.     Parrales a más de 1.700 metros de altitud, clima seco, amplitud térmica y los suelos característicos permiten que esta cepa autóctona despliegue toda su intensidad aromática y frescura natural.     Chimpa, situada a 9 kilómetros del pueblo, se beneficia de condiciones climáticas excepcionales: baja humedad, vientos diarios y tres horas adicionales de sol respecto a la zona núcleo.",
      images: [
        'torrontes-tardio.jpg',
        'torrontes-tardio2.jpg'
      ],
      inStock: 100,
      price: 105120,
      priceBuy: 100000,
      brand:"STUTZ",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Tard_o_Stu_z",
      type: 'shirts',
      category: 'Blanco',
      tags: [ 'blanco' ],
      title: "Tardío Stutz",
      gender: 'men'
    },

    {
      codPro : "4",
      codigoPro : "4",
      medPro : "CAJAX6",
      description: "Cosecha a mano en gamelas de 18kg y estiba de 12 meses en botella. 1005 botellas     Estiba en botella.     Color rojo rubí con tonos violáceos. Límpido, brillante y profundo, con buena densidad visual. Aromas de frutos rojos y negros maduros como ciruelas, cassis y moras con notas especiadas y herbales, con carácter pirazínico marcado, pimientos asados, pimentón y un delicado fondo mineral. En boca entrada dulce y amable. Taninos firmes pero redondeados, con acidez suave y equilibrada. Final persistente con notas especiadas y vegetales asados.      Excelente para acompañar carnes rojas asadas, estofados, carnes de caza, quesos semiduros y duros, pastas con salsas intensas.     Fermentación en tanques de acero inoxidable.     Espalderos con 20 años de edad promedio.     Chimpa, situada a 9 kilómetros del pueblo en línea recta, se beneficia de condiciones climáticas excepcionales: baja humedad, vientos diarios y tres horas adicionales de sol respecto a la zona núcleo.   ",
      images: [
        'cabernet.jpg',
        'cabernet2.jpg'
      ],
      inStock: 100,
      price: 120960,
      priceBuy: 100000,
      brand:"STUTZ",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Cabe_net_S_uvignon_Stutz",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'tinto' ],
      title: "Cabernet Sauvignon Stutz",
      gender: 'men'
    },
    {
      codPro : "5",
      codigoPro : "5",
      medPro : "CAJAX6",
      description: "Cosecha a mano en gamelas de 18kg y estiba de 12 meses en botella. 3800 botellas     Estiba en Botella.      Tannat 35%, Malbec 35%, Cabernet Sauvignon 30%     Color rojo rubí de intensidad media, límpido y brillante, que anticipa frescura y elegancia. En nariz es un vino elegante y complejo, con carácter especiado, frutal y tostado. Notas de frutos rojos y negros caramelizados como arándanos y cerezas, con matices de regaliz, pimienta negra, pimientos asados e incienso.  Entrada amable, con medio de boca franco que expresa frutalidad y especias. Acidez sutil y taninos aterciopelados. Final de boca equilibrado y placentero.     Maridaje ideal para pastas con salsas de tomate, quesos duros y semiduros (como gouda, parmesano o pepato), carnes rojas especiadas y vegetales asados. Acompaña especialmente bien un lomo a la pimienta negra.   Fermentación en tanques de acero inoxidable.     Espalderos con 20 años de edad promedio.     Chimpa, situada a 7 kilómetros del pueblo, se beneficia de condiciones climáticas excepcionales: baja humedad, vientos diarios y tres horas adicionales de sol respecto a la zona núcleo.   ",
      images: [
        'blend.jpg',
        'blend2.jpg'
      ],
      inStock: 100,
      price: 220320,
      priceBuy: 100000,
      brand:"STUTZ",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Gran_Corte_Stutz",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'tinto' ],
      title: "Gran Corte Stutz",
      gender: 'men'
    },
    {
      codPro : "6",
      codigoPro : "6",
      medPro : "CAJAX6",
      description: "Cosecha a mano en gamelas de 18kg y estiba de 12 meses en botella. 4200 botellas      Estiba en Botella.     Color violeta profundo con destellos rubí, límpido y brillante. En nariz presenta gran intensidad aromática conjugando frutos rojos y negros bien maduros como, confituras de ciruelas, frambuesas negras, frutilla, cerezas rojas y negras con suaves matices especiados de pimienta rosa y negra. En boca es un vino de buena estructura con taninos amplios y suaves. Se desarrolla revelando su jugosa frutalidad con un final largo y persistente.     Perfecto para acompañar carnes asadas, quesos semiduros y duros, pastas con salsa a base de tomate. Postres con frutos rojos y chocolate amargo.   Fermentación en tanques de acero inoxidable.     Espalderos con 20 años de edad promedio.     Chimpa, situada a 7 kilómetros del pueblo, se beneficia de condiciones climáticas excepcionales: baja humedad, vientos diarios y tres horas adicionales de sol respecto a la zona núcleo.",
      images: [
        'malbec.jpg',
        'malbec2.jpg'
      ],
      inStock: 100,
      price: 105120,
      priceBuy: 100000,
      brand:"STUTZ",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Malbec_Stutz",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'tinto' ],
      title: "Malbec Stutz",
      gender: 'men'
    },
    {
      codPro : "7",
      codigoPro : "7",
      medPro : "CAJAX6",
      description: "Cosecha a mano en gamelas de 18kg con selección individual y estiba de 12 meses en botella. 995 botellas      Estiba en Botella.     Color rojo guinda, límpido y brillante. Delicado y traslúcido, con tonalidades cereza que reflejan frescura y juventud. Aromas de fruta roja fresca como frambuesa, guinda y cereza. Notas de té negro, pimienta blanca e incienso. Fondo levemente terroso y especiado.  En Boca entrada amable y fluída. Taninos suaves, buena acidez que aporta frescura. Final persistente con carácter frutado y especiado.     Ideal para carnes blancas y rojas magras, quesos blandos y semiduros, frutos secos, ensaladas, wok de verduras y platos típicos españoles.   Fermentación en huevos de concreto.     Espalderos y Parrales con edad promedio de 20 años. Injertados sobre pié Torrontés.     Chimpa, situada a 7 kilómetros del pueblo, se beneficia de condiciones climáticas excepcionales: baja humedad, vientos diarios y tres horas adicionales de sol respecto a la zona núcleo.",
      images: [
        'garnacha.jpg',
        'garnacha2.jpg'
      ],
      inStock: 100,
      price: 120960,
      priceBuy: 100000,
      brand:"STUTZ",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Garnacha_Stutz",
      type: 'shirts',
      category: 'Tinto',
      tags: [ 'tinto' ],
      title: "Garnacha Stutz",
      gender: 'men'
    },

  ]
};