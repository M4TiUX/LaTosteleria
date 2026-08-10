import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      nav: {
        productos: "Productos",
        mantenimientoProductos: "Mantenimiento Productos",
        combos: "Combos",
        procesos: "Procesos",
        menus: "Menús",
        pedidos: "Pedidos",
        mantenimientoMenus: "Mantenimiento Menús",
      },

      user: {
        login: "Iniciar sesión",
        register: "Registrarse",
        logout: "Cerrar sesión",
      },

      language: {
        spanish: "Español",
        english: "Inglés",
      },
      home: {
        slogan: "Descubre nuestros productos y combos especiales.",
      },

      footer: {
        rights: "Todos los derechos reservados",
      },

      products: {
        title: "Nuestros productos",
        description:
          "Conoce nuestra variedad de productos preparados especialmente para disfrutar en cualquier momento del día.",
        loading: "Cargando productos...",
        loadError: "No fue posible cargar los productos.",
        invalidResponse: "La API no devolvió una lista válida de productos.",
        noCategory: "Sin categoría",
        noDescription: "Producto sin descripción.",
        viewDetail: "Ver detalle",
        noProducts: "No se encontraron productos disponibles.",
        detail: {
          title: "Detalle del producto",
          loading: "Cargando producto...",
          loadError: "No fue posible cargar el producto.",
          notFound: "Producto no encontrado.",
          category: "Categoría",
          price: "Precio",
          ingredients: "Ingredientes",
          noIngredients: "No hay ingredientes registrados.",
          back: "Volver",
          backToProducts: "Volver a productos",
          noCategory: "Sin categoría",
          description: "Descripción",
          noDescription: "Producto sin descripción.",
          backToCatalog: "Volver al catálogo",
        },

        maintenance: {
          title: "Mantenimiento de Productos",
          subtitle: "Administra los productos disponibles en el sistema",
          newProduct: "Nuevo Producto",
          searchPlaceholder: "Buscar producto...",
          allCategories: "Todas las categorías",
          total: "Total: {{count}} productos",
          image: "Imagen",
          product: "Producto",
          category: "Categoría",
          price: "Precio",
          status: "Estado",
          actions: "Acciones",
          active: "Activo",
          disabled: "Inhabilitado",
          detail: "Detalle",
          edit: "Editar",
          disable: "Inhabilitar",
          enable: "Habilitar",
          noProducts: "No se encontraron productos",
        },

        form: {
          save: "Guardar producto",
          update: "Actualizar producto",
          saving: "Guardando...",

          createTitle: "Crear producto",
          updateTitle: "Actualizar producto",
          createDescription:
            "Complete la información necesaria para registrar un nuevo producto en el catálogo.",
          updateDescription: "Modifique la información necesaria del producto.",

          name: "Nombre del producto",
          price: "Precio",
          description: "Descripción",
          category: "Categoría",
          selectCategory: "Seleccione una categoría",

          ingredients: "Ingredientes",
          selectIngredients: "Seleccione ingredientes",
          selectSeveralIngredients: "Seleccione uno o varios ingredientes",
          noIngredientsAvailable: "No hay ingredientes disponibles",
          loadingIngredients: "Cargando ingredientes...",

          loadingCategories: "Cargando categorías...",

          productImage: "Imagen del producto",
          imageDescription:
            "Seleccione una imagen para representar el producto.",
          selectImage: "Seleccionar imagen",
          selectedFile: "Archivo seleccionado: {{name}}",
          imagePreview: "Vista previa del producto",
          invalidImage: "Debe seleccionar un archivo de imagen.",

          validation: {
            nameRequired: "El nombre del producto es obligatorio",
            nameMin: "El nombre debe tener al menos 3 caracteres",
            descriptionRequired: "La descripción es obligatoria",
            descriptionMin: "La descripción debe tener al menos 5 caracteres",
            priceNumber: "El precio debe ser un número",
            pricePositive: "El precio debe ser mayor que cero",
            priceRequired: "El precio es obligatorio",
            categorySelect: "Debe seleccionar una categoría",
            categoryRequired: "La categoría es obligatoria",
            ingredientRequired: "Debe seleccionar al menos un ingrediente",
          },

          createSuccess: "Producto registrado correctamente.",
          updateSuccess: "Producto actualizado correctamente.",
          createError: "Ocurrió un error al registrar el producto.",
          updateError: "Ocurrió un error al actualizar el producto.",
          serverError: "No fue posible comunicarse con el servidor.",
        },
      },

      combos: {
        title: "Combos",
        subtitle: "Conozca los combos disponibles en La Tostelería.",
        maintenanceButton: "Mantenimiento de Combos",
        loading: "Cargando combos...",
        loadError: "No fue posible cargar los combos.",
        invalidResponse: "La API no devolvió una lista válida de combos.",
        noDescription: "Combo sin descripción.",
        category: "Categoría",
        noCategory: "Sin categoría",
        specialPrice: "Precio especial",
        viewDetail: "Ver detalle",
        noAvailable: "No hay combos disponibles en este momento.",

        detail: {
          loading: "Cargando información del combo...",
          loadError: "No fue posible cargar la información del combo.",
          notFound: "No se encontró el combo solicitado.",
          backToCombos: "Volver a combos",
          specialCombo: "Combo especial",
          specialPrice: "Precio especial",
          promotionalPrice: "Precio promocional",
          description: "Descripción",
          noDescription: "Combo sin descripción.",
          includedProducts: "Productos incluidos",
          quantity: "Cantidad: {{count}}",
          viewProduct: "Ver producto",
          noProducts: "No hay productos registrados en este combo.",
          backToCatalog: "Volver al catálogo de combos",
        },

        maintenance: {
          title: "Mantenimiento de Combos",
          subtitle: "Administra los combos disponibles en el sistema",
          newCombo: "Nuevo Combo",
          searchPlaceholder: "Buscar combo...",
          allCategories: "Todas las categorías",
          total: "Total: {{count}} combos",
          combo: "Combo",
          category: "Categoría",
          specialPrice: "Precio especial",
          status: "Estado",
          actions: "Acciones",
          noCategory: "Sin categoría",
          active: "Activo",
          disabled: "Inhabilitado",
          detail: "Detalle",
          edit: "Editar",
          disable: "Inhabilitar",
          enable: "Habilitar",
          noCombos: "No se encontraron combos",
        },

        form: {
          createTitle: "Crear Combo",
          updateTitle: "Editar Combo",
          register: "Registrar Combo",
          update: "Actualizar Combo",
          save: "Guardar Combo",
          saving: "Guardando...",

          createSuccess: "Combo registrado correctamente.",
          updateSuccess: "Combo actualizado correctamente.",
          createError: "Ocurrió un error al registrar el combo.",
          updateError: "Ocurrió un error al actualizar el combo.",
          loadError: "No fue posible cargar el combo.",

          name: "Nombre del combo",
          description: "Descripción",
          specialPrice: "Precio especial",
          category: "Categoría",
          selectCategory: "Seleccione una categoría",

          includedProducts: "Productos incluidos",
          selectProducts: "Seleccione uno o varios productos",
          productQuantity: "Cantidad de productos",
          quantity: "Cantidad",
          product: "Producto",
          productWithId: "Producto {{id}}",

          validation: {
            nameRequired: "El nombre del combo es obligatorio",
            nameMin: "El nombre debe tener al menos 3 caracteres",

            descriptionRequired: "La descripción es obligatoria",
            descriptionMin: "La descripción debe tener al menos 5 caracteres",

            priceNumber: "El precio debe ser un número",
            pricePositive: "El precio debe ser mayor que cero",
            priceRequired: "El precio especial es obligatorio",

            categorySelect: "Debe seleccionar una categoría",
            categoryRequired: "La categoría es obligatoria",

            productsRequired: "Debe seleccionar al menos un producto",
          },
        },
      },
    },
  },

  en: {
    translation: {
      nav: {
        productos: "Products",
        mantenimientoProductos: "Product Management",
        combos: "Combos",
        procesos: "Processes",
        menus: "Menus",
        pedidos: "Orders",
        mantenimientoMenus: "Menu Management",
      },

      user: {
        login: "Log in",
        register: "Sign up",
        logout: "Log out",
      },

      language: {
        spanish: "Spanish",
        english: "English",
      },
      home: {
        slogan: "Discover our products and special combos.",
      },

      footer: {
        rights: "All rights reserved",
      },

      products: {
        title: "Our products",
        description:
          "Discover our variety of products specially prepared to enjoy at any time of the day.",
        loading: "Loading products...",
        loadError: "Unable to load products.",
        invalidResponse: "The API did not return a valid product list.",
        noCategory: "No category",
        noDescription: "Product without description.",
        viewDetail: "View details",
        noProducts: "No products available.",

        detail: {
          title: "Product details",
          loading: "Loading product...",
          loadError: "Unable to load the product.",
          notFound: "Product not found.",
          category: "Category",
          price: "Price",
          ingredients: "Ingredients",
          noIngredients: "No ingredients registered.",
          back: "Back",

          backToProducts: "Back to products",
          noCategory: "No category",
          description: "Description",
          noDescription: "Product without description.",
          backToCatalog: "Back to catalog",
        },

        maintenance: {
          title: "Product Management",
          subtitle: "Manage the products available in the system",
          newProduct: "New Product",
          searchPlaceholder: "Search product...",
          allCategories: "All categories",
          total: "Total: {{count}} products",
          image: "Image",
          product: "Product",
          category: "Category",
          price: "Price",
          status: "Status",
          actions: "Actions",
          active: "Active",
          disabled: "Disabled",
          detail: "Details",
          edit: "Edit",
          disable: "Disable",
          enable: "Enable",
          noProducts: "No products found",
        },

        form: {
          save: "Save product",
          update: "Update product",
          saving: "Saving...",

          createTitle: "Create product",
          updateTitle: "Update product",
          createDescription:
            "Complete the required information to register a new product in the catalog.",
          updateDescription: "Modify the required product information.",

          name: "Product name",
          price: "Price",
          description: "Description",
          category: "Category",
          selectCategory: "Select a category",

          ingredients: "Ingredients",
          selectIngredients: "Select ingredients",
          selectSeveralIngredients: "Select one or more ingredients",
          noIngredientsAvailable: "No ingredients available",
          loadingIngredients: "Loading ingredients...",

          loadingCategories: "Loading categories...",

          productImage: "Product image",
          imageDescription: "Select an image to represent the product.",
          selectImage: "Select image",
          selectedFile: "Selected file: {{name}}",
          imagePreview: "Product preview",
          invalidImage: "You must select an image file.",

          validation: {
            nameRequired: "Product name is required",
            nameMin: "The name must contain at least 3 characters",
            descriptionRequired: "Description is required",
            descriptionMin:
              "The description must contain at least 5 characters",
            priceNumber: "The price must be a number",
            pricePositive: "The price must be greater than zero",
            priceRequired: "Price is required",
            categorySelect: "You must select a category",
            categoryRequired: "Category is required",
            ingredientRequired: "You must select at least one ingredient",
          },

          createSuccess: "Product registered successfully.",
          updateSuccess: "Product updated successfully.",
          createError: "An error occurred while registering the product.",
          updateError: "An error occurred while updating the product.",
          serverError: "Unable to communicate with the server.",
        },
      },

      combos: {
        title: "Combos",
        subtitle: "Discover the combos available at La Tostelería.",
        maintenanceButton: "Combo Management",
        loading: "Loading combos...",
        loadError: "Unable to load combos.",
        invalidResponse: "The API did not return a valid combo list.",
        noDescription: "Combo without description.",
        category: "Category",
        noCategory: "No category",
        specialPrice: "Special price",
        viewDetail: "View details",
        noAvailable: "There are no combos available at this time.",

        detail: {
          loading: "Loading combo information...",
          loadError: "Unable to load the combo information.",
          notFound: "The requested combo was not found.",
          backToCombos: "Back to combos",
          specialCombo: "Special combo",
          specialPrice: "Special price",
          promotionalPrice: "Promotional price",
          description: "Description",
          noDescription: "Combo without description.",
          includedProducts: "Included products",
          quantity: "Quantity: {{count}}",
          viewProduct: "View product",
          noProducts: "There are no products registered in this combo.",
          backToCatalog: "Back to combo catalog",
        },

        maintenance: {
          title: "Combo Management",
          subtitle: "Manage the combos available in the system",
          newCombo: "New Combo",
          searchPlaceholder: "Search combo...",
          allCategories: "All categories",
          total: "Total: {{count}} combos",
          combo: "Combo",
          category: "Category",
          specialPrice: "Special price",
          status: "Status",
          actions: "Actions",
          noCategory: "No category",
          active: "Active",
          disabled: "Disabled",
          detail: "Details",
          edit: "Edit",
          disable: "Disable",
          enable: "Enable",
          noCombos: "No combos found",
        },

        form: {
          createTitle: "Create Combo",
          updateTitle: "Edit Combo",
          register: "Register Combo",
          update: "Update Combo",
          save: "Save Combo",
          saving: "Saving...",

          createSuccess: "Combo registered successfully.",
          updateSuccess: "Combo updated successfully.",
          createError: "An error occurred while registering the combo.",
          updateError: "An error occurred while updating the combo.",
          loadError: "Unable to load the combo.",

          name: "Combo name",
          description: "Description",
          specialPrice: "Special price",
          category: "Category",
          selectCategory: "Select a category",

          includedProducts: "Included products",
          selectProducts: "Select one or more products",
          productQuantity: "Product quantities",
          quantity: "Quantity",
          product: "Product",
          productWithId: "Product {{id}}",

          validation: {
            nameRequired: "Combo name is required",
            nameMin: "The name must contain at least 3 characters",

            descriptionRequired: "Description is required",
            descriptionMin:
              "The description must contain at least 5 characters",

            priceNumber: "The price must be a number",
            pricePositive: "The price must be greater than zero",
            priceRequired: "The special price is required",

            categorySelect: "You must select a category",
            categoryRequired: "Category is required",

            productsRequired: "You must select at least one product",
          },
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,

  // Idioma inicial
  lng: "es",

  fallbackLng: "es",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
