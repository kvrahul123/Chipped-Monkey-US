// rolePermissions.ts

type Role = 'Admin' | 'supervisor' | 'chipped_monkey_admin';
export const rolePermissions: Record<Role, string[]> = {
  Admin: ['*'],
  supervisor:['dashboard','package/orders','microchip/implanted','microchip/payment','transaction/request','transaction/details/*','products/orders','products/orders/details/*','microchip/list','microchip/view/*','microchip/orders','microchip/orders/create','microchip/orders/update/*','microchip/orders/view/*','microchip/create','microchip/edit/*','users/microchip_implanters','users/create'],
  chipped_monkey_admin: ['dashboard', 'category', 'category/*', 'products', 'products/*', 'services', 'services/*', 'manufactures', 'manufactures/*', 'childcategory', 'childcategory/*','blogs','blogs/*','seo','seo/*']
};

