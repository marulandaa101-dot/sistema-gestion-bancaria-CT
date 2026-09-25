'use server';

import { readJsonFile, writeJsonFile } from '@/lib/storage';
import { ProductoFinanciero } from '@/types/producto';

const FILE_NAME = 'productos.json';

export async function getProductos(): Promise<ProductoFinanciero[]> {
  return await readJsonFile<ProductoFinanciero[]>(FILE_NAME, []);
}

export async function getProductoById(id: string): Promise<ProductoFinanciero | undefined> {
  const productos = await getProductos();
  return productos.find(p => p.id === id);
}

export async function saveProducto(producto: ProductoFinanciero): Promise<{ success: boolean; message: string }> {
  try {
    const productos = await getProductos();
    const index = productos.findIndex(p => p.id === producto.id);
    
    if (index >= 0) {
      productos[index] = producto;
    } else {
      productos.push(producto);
    }
    
    await writeJsonFile(FILE_NAME, productos);
    return { success: true, message: 'Producto guardado exitosamente.' };
  } catch (error) {
    return { success: false, message: 'Error al guardar el producto.' };
  }
}

export async function deleteProducto(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const productos = await getProductos();
    const filtered = productos.filter(p => p.id !== id);
    await writeJsonFile(FILE_NAME, filtered);
    return { success: true, message: 'Producto eliminado correctamente.' };
  } catch (error) {
    return { success: false, message: 'Error al eliminar el producto.' };
  }
}
