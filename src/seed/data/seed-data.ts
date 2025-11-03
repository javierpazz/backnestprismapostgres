import * as bcrypt from 'bcrypt';

// interface SeedProduct {
//     codPro: string;
//     codigoPro: string;
//     description: string;
//     image: string;
//     image1: string;
//     image2: string;
//     image3: string;
//     images: string[];
//     stock: number;
//     inStock: number;
//     minStock: number;
//     price: number;
//     priceBuy: number;
//     porIva: number;
//     sizes: ValidSizes[];
//     slug: string;
//     tags: string[];
//     title: string;
//     medPro: string;
//     category: string;
//     id_category: string;
//     type: ValidTypes;
//     gender: 'men'|'women'|'kid'|'unisex'
// }
interface SeedProduct {
    // _id: string;
    codPro: string;
    codigoPro: string;
    title: string;
    medPro: string;
    slug: string;
    images: string[];
    image: string;
    image1: string;
    image2:  string;
    image3:  string;
    brand:  string;
    category: string;
    id_config?: string;
    supplier?: string;
    id_category: string;
    description: string;
    price: number;
    priceBuy: number;
    inStock: number;
    minStock: number;
    porIva: number;
    rating: number;
    numReviews: number;
    // reviews: Ireview[],
    // tags: string[],
    // type: IType;
    // type: ValidTypes;
    // gender: 'men'|'women'|'kid'|'unisex'
    // sizes: ISize[];
    sizes: ValidSizes[];
    



    // TODO: agregar createdAt y updatedAt
    // createdAt: string;
    // updatedAt: string;


}





type ValidSizes = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
type ValidTypes = 'shirts'|'pants'|'hoodies'|'hats';

interface SeedValuee {
    codVal: string;
    desVal: string;
  
    // TODO: agregar createdAt y updatedAt
    createdAt?: string;
    updatedAt?: string;
  }

interface SeedUser {
    name     : string;
    email    : string;
    password: string;
    role     : string;
    isAdmin    :boolean;
    isActive    :boolean;
    puede?       :boolean;
    tocken?: string;
}


interface SeedData {
    valuee: SeedValuee[];
    users: SeedUser[];
    products: SeedProduct[];
}


export const initialData: SeedData = {


  valuee: [
    {
    codVal: '1',
    desVal: 'EFECTIVO',
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

   users: [
    {
      name: 'Javier1',
      // lastname: 'Javier',
      email: 'admin1@example.com',
      // phone: '1',
      // password: bcrypt.hashSync('Aa123456', 10),
      password: 'Aa123456',
      // image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      isAdmin: true,
      isActive: true,
      role: "admin",
      // roles: [{
      //   id : 1,
      //   name : "ADMIN",
      //   image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      //   route : "/restaurant/orders/list"
      // },
      // {
      //   id : 2,
      //   name : "REPARTIDOR",
      //   image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/delivery.png?alt=media&token=ceb780de-a6fa-4466-a227-1c984bced734",
      //   route : "/delivery/orders/list"
      // },
      // {
      //   id : 3,
      //   name : "CLIENTE",
      //   image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user.png?alt=media&token=7af6485c-405f-4952-8875-f010f182ee8e",
      //   route : "/client/products/list"
      // }
    // ],
    },
  //   {
  //     name: 'Juan',
  //     email: 'user@example.com',
  //     password: bcrypt.hashSync('Aa123456',10),
  //   // password: 'Aa123456',
  //     isAdmin: false,
  //     isActive: true,
  //     role: "user",
  //   //   roles: [{
  //   //     id : 1,
  //   //     name : "ADMIN",
  //   //     image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
  //   //     route : "/restaurant/orders/list"
  //   //   },
  //   //   {
  //   //     id : 2,
  //   //     name : "REPARTIDOR",
  //   //     image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/delivery.png?alt=media&token=ceb780de-a6fa-4466-a227-1c984bced734",
  //   //     route : "/delivery/orders/list"
  //   //   },
  //   // {
  //   //     id : 3,
  //   //     name : "CLIENTE",
  //   //     image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user.png?alt=media&token=7af6485c-405f-4952-8875-f010f182ee8e",
  //   //     route : "/client/products/list"
  //   //   }
  //   // ],
  //     },
  //   {
  //     name: 'Oo',
  //     email: 'Oo@oo.com',
  //     password: bcrypt.hashSync('Aa123456', 10),
  //   // password: 'Aa123456',
  //     isAdmin: false,
  //     isActive: true,
  //     role: "client",
  // //     roles: [{
  // //     id : 1,
  // //     name : "ADMIN",
  // //     image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
  // //     route : "/restaurant/orders/list"
  // //   },
  // //   {
  // //     id : 2,
  // //     name : "REPARTIDOR",
  // //     image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/delivery.png?alt=media&token=ceb780de-a6fa-4466-a227-1c984bced734",
  // //     route : "/delivery/orders/list"
  // //   },
  // // {
  // //     id : 3,
  // //     name : "CLIENTE",
  // //     image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user.png?alt=media&token=7af6485c-405f-4952-8875-f010f182ee8e",
  // //     route : "/client/products/list"
  // //   }
  // // ],
  // },
  ],
        products: [
        {
          // _id: '1',
          codPro: 'A',
          codigoPro: '1',
          title: 'CERTIFICADO LEY',
          medPro: 'Unidad',
          slug: 'CERTIFICADO LEY',
          category: 'Tinto',
          image: '/products/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg', // 679px × 829px
          images: [
            '/products/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg',
            '/products/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg?alt=media&token=4f21d3c6-bbba-408f-b4bb-63fad0282ec7',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg?alt=media&token=4f21d3c6-bbba-408f-b4bb-63fad0282ec7',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg?alt=media&token=4f21d3c6-bbba-408f-b4bb-63fad0282ec7',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 4.5,
          numReviews: 700,
          description: 'Vino Malbec Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'B',
          codigoPro: '2',
          title: 'CERTIFICADO CATASTRAL',
          medPro: 'Unidad',
          slug: 'CERTIFICADO CATASTRAL',
          category: 'Tinto',
          image: '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg', // 679px × 829px
          images: [
            '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
            '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0cda786daa25d10fde5dd4d7af369ebf.jpg?alt=media&token=3ce32eb6-e982-407c-ba48-ae3804e7ff3a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0cda786daa25d10fde5dd4d7af369ebf.jpg?alt=media&token=3ce32eb6-e982-407c-ba48-ae3804e7ff3a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0cda786daa25d10fde5dd4d7af369ebf.jpg?alt=media&token=3ce32eb6-e982-407c-ba48-ae3804e7ff3a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 105,
          description: 'Vino Cabernet Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'C',
          codigoPro: '3',
          title: 'LIBRE DEUDA',
          medPro: 'Unidad',
          slug: 'LIBRE DEUDA',
          category: 'Tinto',
          image: '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg', // 679px × 829px
          images: [
            '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
            '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_5b3c26aba0774671aab572bcadde3bd0.jpg?alt=media&token=3a258879-a1b4-4cb2-9c3d-b77196747c99',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_5b3c26aba0774671aab572bcadde3bd0.jpg?alt=media&token=3a258879-a1b4-4cb2-9c3d-b77196747c99',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_5b3c26aba0774671aab572bcadde3bd0.jpg?alt=media&token=3a258879-a1b4-4cb2-9c3d-b77196747c99',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 1140,
          description: 'Vino Tannat Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'D',
          codigoPro: '4',
          title: 'REDACCION',
          medPro: 'Unidad',
          slug: 'REDACCION',
          category: 'Blanco',
          image: '/products/img_0700be14742225ca421f2db276f77bab.jpg', // 679px × 829px
          images: [
            '/products/img_0700be14742225ca421f2db276f77bab.jpg',
            '/products/img_0700be14742225ca421f2db276f77bab.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 100000,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 4,
          numReviews: 458,
          description: 'Vino Torrontes Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'E',
          codigoPro: '5',
          title: 'AGREGAR A PROTOCOLO',
          medPro: 'Unidad',
          slug: 'AGREGAR A PROTOCOLO',
          category: 'Blanco',
          image: '/products/img_0700be14742225ca421f2db276f77bab.jpg', // 679px × 829px
          images: [
            '/products/img_0700be14742225ca421f2db276f77bab.jpg',
            '/products/img_0700be14742225ca421f2db276f77bab.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 4,
          numReviews: 345,
          description: 'Vino Torrontes Tardio Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'F',
          codigoPro: '6',
          title: 'TESTIMONIO',
          medPro: 'Unidad',
          slug: 'TESTIMONIO',
          category: 'Tinto',
          image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
          images: [
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 40,
          description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'G',
          codigoPro: '7',
          title: 'ARCA',
          medPro: 'Unidad',
          slug: 'ARCA',
          category: 'Tinto',
          image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
          images: [
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 40,
          description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'H',
          codigoPro: '8',
          title: 'UIF',
          medPro: 'Unidad',
          slug: 'UIF',
          category: 'Tinto',
          image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
          images: [
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 40,
          description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'I',
          codigoPro: '9',
          title: 'UIF',
          medPro: 'Unidad',
          slug: 'UIF',
          category: 'Tinto',
          image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
          images: [
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 40,
          description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'J',
          codigoPro: '10',
          title: 'ENTREGA AL CLIENTE',
          medPro: 'Unidad',
          slug: 'ENTREGA AL CLIENTE',
          category: 'Tinto',
          image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
          images: [
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 40,
          description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
        {
          // _id: '1',
          codPro: 'K',
          codigoPro: '11',
          title: 'COBRAR CLIENTE',
          medPro: 'Unidad',
          slug: 'COBRAR CLIENTE',
          category: 'Tinto',
          image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
          images: [
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 40,
          description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },
                {
          // _id: '1',
          codPro: 'L',
          codigoPro: '12',
          title: 'DECLARAR RENTAS',
          medPro: 'Unidad',
          slug: 'DECLARAR RENTAS',
          category: 'Tinto',
          image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
          images: [
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
            '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        ],
          image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
          id_category: "6630f13dd6d68d5c088be2cd",
          sizes: ['M'],
          price: 0,
          priceBuy: 0,
          inStock: 1000,
          minStock: 10,
          porIva: 21,
          brand: 'Stutz',
          rating: 5,
          numReviews: 40,
          description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
        //   id_config: CONFIG1,
        //   supplier: CONFIGSUP,
        },

      ],
}