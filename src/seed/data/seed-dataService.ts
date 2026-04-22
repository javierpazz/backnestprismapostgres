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
  ecoActive: boolean;

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


export const initialDataService: SeedData = {

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
      ecoActive: false,
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
      ecoActive: false,
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
      ecoActive: false,
      gender: 'men',
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
      ecoActive: false,
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
      ecoActive: false,
      gender: 'men'
    },


    {
      codPro : "100001",
      codigoPro : "100001",
      medPro : "UNIDAD",
      description: "Los filtros desechables están diseñados para polvo ambiente, pintura y pelusa. Se pueden utilizar en hoteles, oficinas, hospitales, laboratorios, entre otros ya que este tipo tiene una gran capacidad de retención de polvo. Saturado retiene hasta 2.100 grms/m2 en 1” de grueso y 3.000 grms/m2 en 2” de grueso.",
      images: [
        'fp1.jpg',
        'fp2.jpg',
        'fp3.jpg',
      ],
      inStock: 100000,
      price: 15000,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Filtro_Plano_de_Carton",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Filtro Plano de Carton",
      ecoActive: true,
      gender: 'men'
    },

    {
      codPro : "100002",
      codigoPro : "100002",
      medPro : "UNIDAD",
      description: "Mayor eficiencia que los filtros desechables Son económicos Son fáciles de instalar Pueden ser de diferentes tamaños Excelente opción para personas alérgicas.",
      images: [
        'fpr1.jpg',
        'fpr2.jpg',
        'fpr3.jpg',
        'fpr4.jpg',
      ],
      inStock: 100000,
      price: 17250,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Filtro_de_placa_rígida",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Filtro de placa rígida",
      ecoActive: true,
      gender: 'men'
    },

    {
      codPro : "100003",
      codigoPro : "100003",
      medPro : "UNIDAD",
      description: "Utilizados para separar solidos de un fluido gaseoso. Estos filtros ayudan a mitigar la presencia de contaminantes atmosféricos. Se utilizan sobre todo en instalaciones industriales como una alternativa a los precipitadores electrostáticos. Constan de diversas mangas tejidas dispuestas sobre cestas metálicas. El polvo se acumula en su parte externa. El material del tejido debe adaptarse al uso deseado y las condiciones existentes como la temperatura o la presencia de compuestos corrosivos. El tamaño de los poros limita el tamaño mínimo de las partículas retenidas.",
      images: [
        'fmanga1.jpg',
        'fmanga2.jpg',
      ],
      inStock: 100000,
      price: 45000,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Filtro_manga",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Filtro manga",
      ecoActive: true,
      gender: 'men'
    },
    {
      codPro : "100004",
      codigoPro : "100004",
      medPro : "UNIDAD",
      description: "La mayoría de los filtros HEPA están hechos de una mezcla de fibras de vidrio entrelazadas. Las partículas se capturan en una de cuatro formas: impacto directo, intercepción, difusión o tamizado. Impacto directo: Las partículas grandes viajan en línea recta, chocan y quedan atrapadas. Intercepción: Las partículas chocan con las fibras y permanecen unidas a las fibras. Difusión: A medida que viajan partículas más pequeñas, chocan con la fibra y son capturadas. Tamizado: Se produce cuando la partícula es demasiado grande para caber entre los espacios de la fibra.",
      images: [
        'fh1.jpg',
        'fh2.jpg',
        'fh2.jpg',
      ],
      inStock: 100000,
      price: 56000,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Filtro_HEPA",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Filtro HEPA",
      ecoActive: true,
      gender: 'men'
    },

    {
      codPro : "100005",
      codigoPro : "100005",
      medPro : "METROS",
      description: "Elementos utilizables como Pre-Barrera(antes de otro filtro) o barrera de filtración para los sistemas de tramitación del aire en la ventilación general. Este medio de filtracion combina alto diámetro de apriete del polvo con gota de presión baja y es, debido a una larga vida, extremadamente rentable en el consumo de energía. Disponible en las eficacias G2, G3, G4 y F.",
      images: [
        'fpre1.jpg',
        'fpre2.jpg',
      ],
      inStock: 100000,
      price: 3500,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Pre_Barrera(antes_de_otro_filtro)",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Pre-Barrera(antes de otro filtro)",
      ecoActive: true,
      gender: 'men'
    },


    {
      codPro : "100006",
      codigoPro : "100006",
      medPro : "UNIDAD",
      description: "Filtros fabricados con celulosa importada con alto rango de eficiencia y resistencia a la tracción, para todo tipo de máquinas y compresores. Fabricados en tela punzonada con respaldo de malla de acero inoxidable para circuitos externos de hornos Aero glade, para la industria alimenticia. Estos cartuchos están fabricados en diferentes materiales según los requerimientos del cliente.",
      images: [
        'car1.jpg',
        'car2.jpg',
      ],
      inStock: 100000,
      price: 0,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Cartuchos_para_aire_y_aceite",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Cartuchos para aire y aceite",
      ecoActive: true,
      gender: 'men'
    },


    {
      codPro : "100007",
      codigoPro : "100007",
      medPro : "UNIDAD",
      description: "Agua libre de exceso de minerales como el magnesio o el calcio que aportan mal gusto. Elimina la presencia de bacterias que producen problemas gastrointestinales y afectan en mayor medida a los niños y a las personas mayores que habitan en el hogar. Menor presencia de compuestos orgánicos en el agua como son los hidrocarburos, así como insecticidas y pesticidas que pueden verterse en el agua de zonas rurales y de intensa actividad agrícola. Cuidado del medio ambiente al tener que usar menos jabones y otros productos en electrodomésticos que cuando se utiliza un agua más dura. Y es que éstos suelen estar llenos de sustancias químicas que producen un impacto negativo en el planeta.",
      images: [
        'abla1.jpg',
        'abla2.jpg',
      ],
      inStock: 100000,
      price: 0,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Ablandador_de_Agua",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Ablandador de Agua",
      ecoActive: true,
      gender: 'men'
    },

    {
      codPro : "100008",
      codigoPro : "100008",
      medPro : "UNIDAD",
      description: "La osmosis es el proceso mediante el cual dos soluciones con diferente concentración son separadas a través de una membrana semipermeable. El equipo de Ósmosis Inversa es capaz de eliminar el 98% de las sales disueltas en el agua. Como resultado de este proceso obtenemos un agua de altísima calidad y perfecta para su consumo.",
      images: [
        'osmo1.jpg',
        'osmo2.jpg',
      ],
      inStock: 100000,
      price: 0,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Equipo_de_ósmosis_inversa",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Equipo de ósmosis inversa",
      ecoActive: true,
      gender: 'men'
    },

    {
      codPro : "100009",
      codigoPro : "100009",
      medPro : "UNIDAD",
      description: "Disponer de un dispenser de agua a red en tu oficina o empresa es una muy buena solución para facilitar y garantizar una correcta hidratación de los trabajadores. A continuación resumimos los puntos claves que hacen de esta fuente de agua una alternativa cada vez más popular entre todo tipo de empresas y particulares.",
      images: [
        'dispenser1.jpg',
        'dispenser2.jpg',
      ],
      inStock: 100000,
      price: 0,
      priceBuy: 1,
      brand:"FN",
      porIva: 21,
      sizes: [ 'M' ],
      slug: "Dispenser_de_agua_de_red:",
      type: 'shirts',
      category: 'Filtros',
      tags: [ 'tar' ],
      title: "Dispenser de agua de red:",
      ecoActive: true,
      gender: 'men'
    },





  ]
};