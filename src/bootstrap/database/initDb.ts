import { UserDocument } from 'src/auth/user.schema';
import { Model } from 'mongoose';
import {
  EPermissions,
  Permission,
  PermissionDocument,
} from 'src/auth/permission.schema';
import { usersInit } from './users.init';
import { ProductDocument } from 'src/product/product.schema';
import { Shutter, ShutterDocument } from 'src/product/shutter.schema';
import { Cill, CillDocument } from 'src/product/cill.schema';
import { Vent, VentDocument } from 'src/product/vent.schema';
import { Wage, WageDocument } from 'src/product/wage.schema';
import { initialProducts } from './products';
import { deepCopy_JSON } from 'src/utils/arrayFunctions';

export async function initDb(
  userModel: Model<UserDocument>,
  permissionModel: Model<PermissionDocument>,
  productModel: Model<ProductDocument>,
  shutterModel: Model<ShutterDocument>,
  cillModel: Model<CillDocument>,
  ventModel: Model<VentDocument>,
  wageModel: Model<WageDocument>,
  forceReset = false, // can be called by admin.rest
) {
  console.log(`Preparing database... forceReset: (${forceReset})`);
  if (forceReset || process.env.RECREATE_DB_ON_START === 'true') {
    await initPermissions(permissionModel);
    await initUsers(userModel, permissionModel);
    await initProducts(
      productModel,
      shutterModel,
      cillModel,
      ventModel,
      wageModel,
    );
  }
}

// * ROLES
/* async function initRoles(databaseConnection: Connection) {
  console.log('Roles are not implemented yet');
} */

//* PERMISSIONS
async function initPermissions(permissionModel: Model<PermissionDocument>) {
  //Cleanup
  // Catching error when there is no database+collection yet will just proceeds the database to create missing collections...
  await permissionModel.collection.drop().catch((err: any) => {
    console.log(err);
  });
  //Insert default
  const permissions: Permission[] = [];
  Object.values(EPermissions).forEach((name) => {
    const permission = new Permission();
    permission.name = name;
    permissions.push(permission);
  });
  const permissionsResult = await permissionModel.insertMany(permissions);

  console.log('permissionsResult');
  console.log(permissionsResult);
}

// * USERS
async function initUsers(
  userModel: Model<UserDocument>,
  permissionModel: Model<PermissionDocument>,
) {
  //Cleanup
  await userModel.collection.drop();

  const existingPermissions: Permission[] = await permissionModel.find();
  const usersToCreate = [];
  const usersTemplates = deepCopy_JSON(usersInit);
  usersTemplates.forEach((user) => {
    const requestedPermissions = user.permissions;

    const permissionsToAdd = existingPermissions.filter((permission) =>
      requestedPermissions.includes(permission.name),
    );
    const permissionsToAddIds = permissionsToAdd.map(
      (permission) => permission._id,
    );
    const userToPush: any = user; // Overwriting Enum Permissions to database Permission instances
    userToPush.permissions = permissionsToAddIds;
    usersToCreate.push(userToPush);
  });

  const userResult = await userModel.insertMany(usersToCreate);

  console.log('userResult');
  console.log(userResult);
}

// * ROLES PERMISSIONS
/* async function connectRolesWithPermissions(databaseConnection: Connection) {
  //Cleanup
  await databaseConnection.query('DELETE FROM permission;');
  //Insert default
  const permissions: string[] = [];
  Object.values(EPermissions).forEach((permission) =>
    permissions.push(
      `INSERT INTO permission VALUES (uuid_generate_v4 ()::uuid,'${permission}');`,
    ),
  );
  const permissionsResult = await databaseConnection.query(
    permissions.join(' '),
  );

  console.log('permissionsResult');
  console.log(permissionsResult);
} */

// * ROLES PERMISSIONS
async function initProducts(
  productModel: Model<ProductDocument>,
  shutterModel: Model<ShutterDocument>,
  cillModel: Model<CillDocument>,
  ventModel: Model<VentDocument>,
  wageModel: Model<WageDocument>,
) {
  //Cleanup
  await productModel.collection.drop();
  await shutterModel.collection.drop();
  await cillModel.collection.drop();
  await ventModel.collection.drop();
  await wageModel.collection.drop();

  //Products
  await productModel.insertMany(initialProducts);

  /// Shutter
  const shutter: Shutter = {
    muanyag: {
      name: 'Műanyag',
      maxRendelhetoNm: 1000,
      minFizetendoNm: 1000,
      nmAr: 1000,
    },
    muanyagSzunyoghalos: {
      name: 'Műanyag kombi szúnyoghálóval',
      maxRendelhetoNm: 1000,
      minFizetendoNm: 1000,
      nmAr: 1000,
    },
    aluminium: {
      nmAr: 1000,
      name: 'Alumínium',
      egycsatornasKapcsoloAr: 1000,
      egycsatornasTaviranyitoAr: 1000,
      kapcsoloAr: 1000,
      maxRendelhetoNm: 1000,
      minFizetendoNm: 1000,
      motorAr: 1000,
      otpluszegyCsatornasTaviranyitoAr: 1000,
    },
    aluminiumSzunyoghalos: {
      name: 'Alumínium kombi szúnyoghálóval',
      egycsatornasKapcsoloAr: 1000,
      egycsatornasTaviranyitoAr: 1000,
      maxRendelhetoNm: 1000,
      minFizetendoNm: 1000,
      motorAr: 1000,
      nmAr: 1000,
      otpluszegyCsatornasTaviranyitoAr: 1000,
    },
    mobilSzunyoghalo: {
      name: 'Mobil szúnyogháló',
      maxRendelhetoNm: 1000,
      minFizetendoNm: 1000,
      nmAr: 1000,
    },
  };
  await shutterModel.insertMany([shutter]);

  // Cill
  const cill: Cill = {
    pvc: {
      cm10: 400,
      cm20: 400,
      cm30: 400,
      cm40: 400,
      cm50: 400,
      cm60: 400,
    },
    aluminium: {
      cm10: 400,
      cm20: 400,
      cm30: 400,
      cm40: 400,
      cm50: 400,
      cm60: 400,
    },
    fa: {
      cm10: 400,
      cm20: 400,
      cm30: 400,
      cm40: 400,
      cm50: 400,
      cm60: 400,
    },
  };
  await cillModel.insertMany([cill]);

  // Vent
  const vent: Vent = {
    akusztikus: 50,
    zarhato: 50,
    automata: 50,
    gaz: 50,
  };

  await ventModel.insertMany([vent]);

  // Wage
  const wage: Wage = {
    bontasBeepites: 1000,
    faBeepites: 1000,
    ujAblak: 1000,
    kiszallas: {
      zona0: 30,
      zona1: 30,
      zona2: 30,
      zona3: 30,
      zona4: 30,
      zona5: 30,
    },
    szallitas: {
      zona0: 30,
      zona1: 30,
      zona2: 30,
      zona3: 30,
      zona4: 30,
      zona5: 30,
    },
  };

  await wageModel.insertMany([wage]);
}
