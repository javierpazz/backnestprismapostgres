import { Module } from '@nestjs/common';
// import { ProductsModule } from './products/products.module';
// import { ProductsnextModule } from './productsnext/productsnext.module';
// import { AddressnextModule } from './addressnext/addressnext.module';
// import { CategoryModule } from './category/category.module';
// import { CountryModule } from './country/country.module';
// import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { CustomersModule } from './customers/customers.module';
import { InstrumentosModule } from './instrumentos/instrumentos.module';
import { PartesModule } from './partes/partes.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { EntradasModule } from './entradas/entradas.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ValoresModule } from './valores/valores.module';
import { EncargadosModule } from './encargados/encargados.module';
import { EstadosordenModule } from './estadosorden/estadosorden.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { ProductoFacModule } from './producto-fac/producto-fac.module';

@Module({
  imports: [ProductsModule, ConfigurationsModule, AuthModule, CustomersModule, InstrumentosModule, PartesModule, UsersModule, EntradasModule, ProveedoresModule, ValoresModule, EncargadosModule, EstadosordenModule, ComprobanteModule, ProductoFacModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
