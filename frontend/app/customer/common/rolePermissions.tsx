// rolePermissions.ts

type Role = 'Admin' | 'chipped_monkey_admin';
export const rolePermissions: Record<Role, string[]> = {
  Admin: ['*'],
  chipped_monkey_admin: ['dashboard', 'category', 'category/*', 'products', 'products/*', 'services', 'services/*', 'manufactures', 'manufactures/*', 'childcategory', 'childcategory/*','blogs','blogs/*','seo','seo/*']
};

