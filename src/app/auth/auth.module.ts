import { AngularMaterialModule } from "src/angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        AngularMaterialModule,
        AuthRoutingModule,
        CommonModule,
        FormsModule
    ]

})
export class AuthModule {}