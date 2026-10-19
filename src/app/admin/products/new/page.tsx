import { createProduct } from "@/app/admin/products/actions";
import { PageHeader } from "@/components/dashboard/AdminUI";
import { ProductForm } from "@/components/dashboard/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalogue · Nouveau"
        title="Créer un produit"
        description="Nom, photo, prix. Le SKU et l’URL se composent tout seuls. La photo : un fichier, ou un lien."
      />
      <ProductForm action={createProduct} />
    </div>
  );
}
