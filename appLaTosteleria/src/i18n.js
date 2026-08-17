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
        mantenimientoProcesos: "Mantenimiento Procesos",
        menus: "Menús",
        pedidos: "Pedidos",
        mantenimientoMenus: "Mantenimiento Menús",
        mantenimientoCombos: "Mantenimiento de Combos",
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
          statusEnabledSuccess: "Producto activado correctamente.",
          statusDisabledSuccess: "Producto desactivado correctamente.",
          statusChangeError: "No fue posible cambiar el estado del producto.",
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
            imageRequired: "Debe seleccionar una imagen para el producto.",
            invalidImage:
              "Debe seleccionar una imagen en formato PNG, JPG, JPEG o WEBP.",
            nameLetters:
              "El nombre del producto debe contener al menos una letra.",
            duplicateName: "Ya existe un producto registrado con ese nombre.",
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

          image: "Imagen",
          statusEnabledSuccess: "Combo habilitado correctamente.",
          statusDisabledSuccess: "Combo inhabilitado correctamente.",
          statusChangeError: "No fue posible cambiar el estado del combo.",
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

          comboImage: "Imagen del combo",

          imageDescription: "Seleccione una imagen relacionada con el combo.",

          selectImage: "Seleccionar imagen",

          selectedFile: "Archivo seleccionado: {{name}}",

          imagePreview: "Vista previa de la imagen del combo",

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

            nameLetters:
              "El nombre del combo debe contener al menos una letra.",

            imageRequired: "Debe seleccionar una imagen para el combo.",

            invalidImage:
              "Debe seleccionar una imagen en formato PNG, JPG, JPEG o WEBP.",

            duplicateName: "Ya existe un combo registrado con ese nombre.",
          },
        },
      },

      menus: {
        common: {
          products: "Productos",
          combos: "Combos",
          start: "Inicio",
          end: "Fin",
          status: "Estado",
          actions: "Acciones",
          detail: "Detalle",
          edit: "Editar",
          save: "Guardar",
          saving: "Guardando...",
          enable: "Habilitar",
          disable: "Inhabilitar",
          noCategory: "Sin categoría",
        },

        status: {
          active: "Activo",
          inactive: "Inactivo",
          available: "Disponible",
          availableNow: "Disponible ahora",
          unavailable: "Fuera de horario",
          activeMenu: "Menú activo",
          inactiveMenu: "Menú inactivo",
        },

        list: {
          loading: "Cargando menús...",
          title: "Menús registrados",
          description: "Consulta los menús registrados por fecha y horario.",
          availableDescription:
            "Consulta los menús disponibles en La Tostelería.",
          showAvailable: "Mostrar solo disponibles",
          showingAvailable: "Mostrando solo disponibles",
          viewMenu: "Ver menú",
          noAvailable: "No hay menús disponibles en este momento.",
        },

        available: {
          loading: "Cargando menú disponible...",
          noMenu: "No hay un menú disponible en este momento.",
          title: "Menús disponibles ahora",
          description:
            "El sistema muestra un único menú disponible según la fecha y hora actual.",
          availableNow: "Disponible ahora",
          availability:
            "Disponible del {{startDate}} {{startTime}} al {{endDate}} {{endTime}}.",
          viewDetail: "Ver detalle completo",
        },

        detail: {
          loading: "Cargando menú...",
          notFound: "No se encontró el menú solicitado.",
          availability:
            "Disponible del {{startDate}} {{startTime}} al {{endDate}} {{endTime}}.",
          back: "Volver al listado",
        },

        create: {
          title: "Crear menú",
          description:
            "Registre la disponibilidad, los productos y los combos que formarán parte del menú.",
          save: "Guardar menú",
          error: "No fue posible registrar el menú.",
        },

        edit: {
          title: "Modificar menú",
          description:
            "Actualice la disponibilidad y los elementos incluidos en el menú.",
          update: "Actualizar menú",
          loadError: "No fue posible cargar el menú solicitado.",
          updateError: "No fue posible actualizar el menú.",
          notFound: "No se encontró el menú solicitado.",
        },

        form: {
          title: "Información del menú",
          name: "Nombre del menú",
          startDate: "Fecha de inicio",
          endDate: "Fecha de fin",
          startTime: "Hora de inicio",
          endTime: "Hora de fin",
          active: "Menú activo",

          products: "Productos",
          combos: "Combos",

          selectMultiple: "Seleccione uno o varios {{items}}",
          noAvailable: "No hay {{items}} disponibles",
          loadingItems: "Cargando {{items}}...",

          itemHint:
            "Los elementos se agrupan por categoría para facilitar la selección.",

          comboHint:
            "Si el menú no incluye combos, puede dejar esta selección vacía mientras exista al menos un producto.",

          save: "Guardar menú",
          saving: "Guardando...",

          validation: {
            nameRequired: "El nombre del menú es obligatorio.",
            nameMin: "El nombre del menú debe tener al menos 3 caracteres.",
            nameMax: "El nombre del menú no puede superar los 100 caracteres.",

            startDateRequired: "La fecha de inicio es obligatoria.",
            startDateFormat:
              "La fecha de inicio debe tener formato YYYY-MM-DD.",

            endDateRequired: "La fecha de fin es obligatoria.",
            endDateFormat: "La fecha de fin debe tener formato YYYY-MM-DD.",

            dateRange:
              "La fecha de inicio no puede ser mayor que la fecha final.",

            startTimeRequired: "La hora de inicio es obligatoria.",
            startTimeFormat: "La hora de inicio debe tener formato HH:MM.",

            endTimeRequired: "La hora de fin es obligatoria.",
            endTimeFormat: "La hora de fin debe tener formato HH:MM.",

            timeRange:
              "La hora de inicio no puede ser mayor que la hora final cuando las fechas son iguales.",

            itemsRequired: "Debe seleccionar al menos un producto o un combo.",
          },
        },

        maintenance: {
          loading: "Cargando mantenimiento de menús...",
          title: "Mantenimiento de Menús",
          description: "Administra los menús registrados en el sistema",
          newMenu: "Nuevo Menú",

          search: "Buscar menú...",
          allStatuses: "Todos los estados",
          total: "Total: {{count}} menús",

          id: "ID",
          menu: "Menú",
          start: "Inicio",
          end: "Fin",
          status: "Estado",
          actions: "Acciones",

          detail: "Detalle",
          edit: "Editar",
          enable: "Habilitar",
          disable: "Inhabilitar",
          saving: "Guardando...",

          noResults: "No se encontraron menús",
          loadError: "No fue posible cargar los menús.",

          confirmEnable: '¿Desea activar el menú "{{name}}"?',
          confirmDisable: '¿Desea desactivar el menú "{{name}}"?',

          enableSuccess: "El menú fue activado correctamente.",
          disableSuccess: "El menú fue desactivado correctamente.",
          statusError: "No fue posible actualizar el estado del menú.",
        },
      },

      processMaintenance: {
        title: "Mantenimiento de procesos",
        description:
          "Administre los procesos de preparación asociados a los productos.",

        newProcess: "Nuevo proceso",
        search: "Buscar por producto...",
        product: "Producto",
        stations: "Estaciones",
        actions: "Acciones",

        detail: "Detalle",
        edit: "Editar",
        delete: "Eliminar",

        loadingError: "No fue posible cargar los procesos.",
        noResults: "No se encontraron procesos.",

        deleteDialog: {
          title: "Eliminar proceso",
          message:
            "¿Está seguro de eliminar el proceso de preparación de {{product}}? Esta acción eliminará todos sus pasos.",
          cancel: "Cancelar",
          delete: "Eliminar",
          deleting: "Eliminando...",
          error: "No fue posible eliminar el proceso.",
        },

        form: {
          product: "Producto",
          stepsTitle: "Pasos del proceso",
          stepsDescription:
            "Seleccione la estación y el tiempo estimado para cada paso.",
          step: "Paso {{number}}",
          station: "Estación",
          estimatedTime: "Tiempo estimado (minutos)",
          addStep: "Agregar paso",
          save: "Guardar proceso",
          saving: "Guardando...",

          createSuccess: "Proceso registrado correctamente.",
          updateSuccess: "Proceso actualizado correctamente.",
          deleteSuccess: "Proceso eliminado correctamente.",

          createError: "Ocurrió un error al registrar el proceso.",
          updateError: "Ocurrió un error al actualizar el proceso.",
          deleteError: "Ocurrió un error al eliminar el proceso.",

          serverError: "No fue posible comunicarse con el servidor.",

          loadOptionsError: "No fue posible cargar los productos y estaciones.",

          validation: {
            product: "Debe seleccionar un producto.",
            minimumStep: "El proceso debe tener al menos una estación.",
            station: "Debe seleccionar una estación en todos los pasos.",
            time: "El tiempo estimado debe ser mayor a cero.",
          },

          saveError: "Ocurrió un error al guardar el proceso.",
        },

        create: {
          title: "Crear proceso",
          description:
            "Seleccione el producto y defina las estaciones que forman su proceso de preparación.",
          button: "Registrar proceso",
          error: "No fue posible registrar el proceso.",
        },

        update: {
          title: "Editar proceso",
          description:
            "Modifique las estaciones y tiempos del proceso de preparación.",
          button: "Actualizar proceso",
          loadError: "No fue posible cargar el proceso.",
          updateError: "No fue posible actualizar el proceso.",
        },
      },

      orders: {
        common: {
          back: "Volver",
          cancel: "Cancelar",
          client: "Cliente",
          combo: "Combo",
          createdAt: "Fecha de creación",
          date: "Fecha",
          delete: "Eliminar",
          deliveryMethod: "Método de entrega",
          email: "Correo",
          noNotes: "Sin observaciones.",
          noTracking: "Sin seguimiento",
          notes: "Observaciones",
          orderNumber: "Pedido #{{id}}",
          paymentMethod: "Método de pago",
          product: "Producto",
          productsAndCombos: "Productos y combos",
          quantity: "Cantidad: {{count}}",
          quantityLabel: "Cantidad",
          save: "Guardar",
          saving: "Guardando...",
          status: "Estado",
          subtotal: "Subtotal",
          summary: "Resumen",
          taxes: "Impuestos",
          total: "Total",
        },

        create: {
          title: "Nuevo pedido",
          description:
            "Selecciona un menú activo y arma el pedido agregando o quitando productos y combos.",
          viewHistory: "Ver historial",
          loadingMenus: "Cargando menús para crear el pedido...",
          menu: "Menú",
          storePickup: "Retiro en tienda",
          homeDelivery: "Domicilio",
          loadingAddresses: "Cargando direcciones...",
          noSavedAddresses:
            "No tiene direcciones guardadas. Puede seleccionar una ubicación en el mapa más abajo.",
          deliveryAddress: "Dirección de entrega",
          location: "Ubicación",
          unnamedAddress: "Dirección sin nombre",
          mapInstruction: "Haz clic en el mapa para seleccionar una ubicación",
          selectedLocation: "Ubicación seleccionada",
          saveAsAddress: "Guardar como dirección",
          mapHint: "Haz clic en el mapa para seleccionar una ubicación",
          orderNotes: "Observaciones del pedido",
          orderNotesPlaceholder:
            "Ejemplo: sin cebolla, empacar por separado, retirar a nombre de Ana",
          characters500: "{{count}}/500 caracteres",
          characters300: "{{count}}/300 caracteres",
          start: "Inicio",
          end: "Fin",
          loadingMenuDetail: "Cargando detalle del menú...",
          remove: "Quitar",
          add: "Agregar",
          inOrder: "{{count}} en pedido",
          summary: "Resumen del pedido",
          items: "{{count}} items",
          emptyCart: "Todavía no has agregado productos ni combos.",
          itemNote: "Observación para {{type}}",
          itemNotePlaceholder: "Indicaciones para este producto o combo",
          shipping: "Envío",
          method: "Método",
          cash: "Efectivo",
          card: "Tarjeta",
          amountReceived: "Monto recibido",
          insufficientAmount: "El monto recibido es insuficiente.",
          lastFourDigits: "Últimos 4 dígitos",
          lastFourDigitsHelp: "Digite únicamente los últimos 4 dígitos.",
          submitting: "Registrando pedido...",
          confirm: "Confirmar pedido",
          clearOrder: "Limpiar pedido",
          loginWarning:
            "Debe iniciar sesión para registrar el pedido. Ya no se usa un cliente por defecto del sistema.",
          saveLocationTitle: "Guardar ubicación como dirección",
          saveLocationDescription:
            'Escribe una descripción o referencia para esta ubicación (ej: "Casa", "Oficina", "Calle 123").',
          addressDetails: "Detalles de la dirección",
          coordinates: "Coordenadas",

          errors: {
            loadMenus: "No fue posible cargar los menús disponibles.",
            loadMenu: "No fue posible cargar el menú seleccionado.",
            loadAddresses: "No fue posible cargar las direcciones guardadas.",
            selectMapLocation: "Primero selecciona una ubicación en el mapa.",
            addressDescription:
              "Debes escribir una descripción o referencia de la dirección.",
            saveAddress: "No se pudo guardar la dirección.",
            loginRequired: "Debe iniciar sesión para registrar un pedido.",
            menuRequired: "Debe seleccionar un menú antes de crear el pedido.",
            itemRequired:
              "Debe agregar al menos un producto o combo al pedido.",
            addressRequired:
              "Debe guardar la ubicación seleccionada como dirección antes de continuar.",
            amountRequired: "Debe indicar el monto recibido.",
            insufficientAmount:
              "El monto recibido es insuficiente para pagar el pedido.",
            cardBrandRequired: "Debe seleccionar la marca de la tarjeta.",
            cardDigits:
              "Debe ingresar exactamente los últimos 4 dígitos de la tarjeta.",
            createOrder: "No fue posible registrar el pedido.",
          },
        },

        list: {
          loading: "Cargando pedidos...",
          loadError: "No fue posible cargar el historial de pedidos.",
          titles: {
            client: "Mis pedidos",
            staff: "Administración de pedidos",
            default: "Historial de pedidos",
          },
          descriptions: {
            client:
              "Consulta tus pedidos registrados y accede al seguimiento de cada uno.",
            staff:
              "Consulta los pedidos registrados por los clientes y utiliza los filtros para localizar la información.",
            default: "Consulta los pedidos registrados.",
          },
          newOrder: "Nuevo pedido",
          filters: {
            title: "Filtros del historial",
            all: "Todos",
            startDate: "Fecha inicial",
            endDate: "Fecha final",
            clear: "Limpiar",
            showing: "Mostrando {{filtered}} de {{total}} pedidos.",
          },
          noResults: {
            title: "No hay pedidos que coincidan con los filtros actuales.",
            description:
              "Ajusta el estado o el rango de fechas para consultar otros pedidos.",
            create: "Crear pedido",
          },
          items: "{{count}} items",
          created: "Creado",
          lastMovement: "Último movimiento",
          moreItems: "y {{count}} elementos más...",
          actions: {
            detail: "Ver detalle",
            tracking: "Ver seguimiento",
            repeat: "Repetir pedido",
          },
        },

        detail: {
          loading: "Cargando detalle del pedido...",
          loadError: "No fue posible cargar el pedido.",
          unauthorized: "No tiene autorización para consultar este pedido.",
          backToOrders: "Volver a pedidos",
          notFound: "No se encontró el pedido solicitado.",
          description: "Detalle completo del pedido.",
          viewInvoice: "Ver factura",
          orderInfo: "Información del pedido",
          generalNotes: "Observaciones generales",
          noItems: "Este pedido no contiene elementos registrados.",
          unitPrice: "Precio unitario",
        },

        invoice: {
          loading: "Cargando factura...",
          loadError: "No fue posible cargar la factura.",
          notFound: "No se encontró la factura.",
          title: "Factura #{{id}}",
          generalInfo: "Información general",
          manager: "Encargado",
          notApplicable: "No aplica",
          notRegistered: "No registrado",
          detailTitle: "Detalle de la factura",
          noItems: "No hay elementos registrados.",
          each: "c/u",
          linePrice: "Precio",
          lineSubtotal: "Subtotal",
          lineTax: "Impuesto",
        },

        summary: {
          title: "Resumen de factura",
          amountPaid: "Monto pagado",
          amountReceived: "Monto recibido",
          change: "Vuelto",
          brand: "Marca",
          card: "Tarjeta",
          totalBeforeTax: "Total sin impuesto",
          shippingCost: "Costo de envío",
          totalWithTax: "Total con impuesto",
        },

        tracking: {
          orderRequired:
            "Debe indicar un pedido para consultar el seguimiento.",
          loadError: "No fue posible consultar el seguimiento.",
          locationError:
            "No fue posible consultar la ubicación del repartidor.",
          demoError: "No fue posible crear el pedido demo.",
          loading: "Cargando seguimiento del pedido...",
          title: "Seguimiento del pedido",
          description:
            "El estado se actualiza automáticamente cada 5 segundos mientras el pedido siga en proceso.",
          creatingDemo: "Creando...",
          createDemo: "Crear demo",
          progress: "Progreso",
          mapLocation: "Ubicación en el mapa",
          store: "La Tostelería (tienda)",
          deliveryAddress: "Dirección de entrega",
          driver: "Repartidor",
          route: "del trayecto",
          driverPositionUpdates: "La posición del repartidor se actualiza cada",
          seconds: "segundos",
          outForDelivery: "El pedido salió a entrega.",
          readyForPickup: "El pedido está listo para retiro.",
          history: "Historial del pedido",
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
        mantenimientoProcesos: "Process Maintenance",
        menus: "Menus",
        pedidos: "Orders",
        mantenimientoMenus: "Menu Management",
        mantenimientoCombos: "Combo Management",
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
          statusEnabledSuccess: "Product enabled successfully.",
          statusDisabledSuccess: "Product disabled successfully.",
          statusChangeError: "Unable to change the product status.",
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
            imageRequired: "You must select an image for the product.",
            invalidImage:
              "You must select an image in PNG, JPG, JPEG, or WEBP format.",
            nameLetters: "The product name must contain at least one letter.",
            duplicateName: "A product with that name already exists.",
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

          image: "Image",
          statusEnabledSuccess: "Combo enabled successfully.",
          statusDisabledSuccess: "Combo disabled successfully.",
          statusChangeError: "The combo status could not be changed.",
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

          comboImage: "Combo image",

          imageDescription: "Select an image related to the combo.",

          selectImage: "Select image",

          selectedFile: "Selected file: {{name}}",

          imagePreview: "Combo image preview",

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

            nameLetters: "The combo name must contain at least one letter.",

            imageRequired: "You must select an image for the combo.",

            invalidImage:
              "You must select an image in PNG, JPG, JPEG, or WEBP format.",

            duplicateName: "A combo with that name already exists.",
          },
        },
      },

      menus: {
        common: {
          products: "Products",
          combos: "Combos",
          start: "Start",
          end: "End",
          status: "Status",
          actions: "Actions",
          detail: "Details",
          edit: "Edit",
          save: "Save",
          saving: "Saving...",
          enable: "Enable",
          disable: "Disable",
          noCategory: "No category",
        },

        status: {
          active: "Active",
          inactive: "Inactive",
          available: "Available",
          availableNow: "Available now",
          unavailable: "Outside available hours",
          activeMenu: "Active menu",
          inactiveMenu: "Inactive menu",
        },

        list: {
          loading: "Loading menus...",
          title: "Registered menus",
          description: "View registered menus by date and schedule.",
          availableDescription: "View the menus available at La Tostelería.",
          showAvailable: "Show available only",
          showingAvailable: "Showing available only",
          viewMenu: "View menu",
          noAvailable: "There are no menus available at this time.",
        },

        available: {
          loading: "Loading available menu...",
          noMenu: "There is no menu available at this time.",
          title: "Menus available now",
          description:
            "The system displays a single available menu based on the current date and time.",
          availableNow: "Available now",
          availability:
            "Available from {{startDate}} {{startTime}} to {{endDate}} {{endTime}}.",
          viewDetail: "View full details",
        },

        detail: {
          loading: "Loading menu...",
          notFound: "The requested menu was not found.",
          availability:
            "Available from {{startDate}} {{startTime}} to {{endDate}} {{endTime}}.",
          back: "Back to list",
        },

        create: {
          title: "Create menu",
          description:
            "Enter the availability, products, and combos that will be included in the menu.",
          save: "Save menu",
          error: "Unable to create the menu.",
        },

        edit: {
          title: "Edit menu",
          description:
            "Update the availability and the items included in the menu.",
          update: "Update menu",
          loadError: "Unable to load the requested menu.",
          updateError: "Unable to update the menu.",
          notFound: "The requested menu was not found.",
        },

        form: {
          title: "Menu information",
          name: "Menu name",
          startDate: "Start date",
          endDate: "End date",
          startTime: "Start time",
          endTime: "End time",
          active: "Active menu",

          products: "Products",
          combos: "Combos",

          selectMultiple: "Select one or more {{items}}",
          noAvailable: "No {{items}} available",
          loadingItems: "Loading {{items}}...",

          itemHint: "Items are grouped by category to make selection easier.",

          comboHint:
            "If the menu does not include combos, you may leave this selection empty as long as at least one product is selected.",

          save: "Save menu",
          saving: "Saving...",

          validation: {
            nameRequired: "The menu name is required.",
            nameMin: "The menu name must contain at least 3 characters.",
            nameMax: "The menu name cannot exceed 100 characters.",

            startDateRequired: "The start date is required.",
            startDateFormat: "The start date must use the YYYY-MM-DD format.",

            endDateRequired: "The end date is required.",
            endDateFormat: "The end date must use the YYYY-MM-DD format.",

            dateRange: "The start date cannot be later than the end date.",

            startTimeRequired: "The start time is required.",
            startTimeFormat: "The start time must use the HH:MM format.",

            endTimeRequired: "The end time is required.",
            endTimeFormat: "The end time must use the HH:MM format.",

            timeRange:
              "The start time cannot be later than the end time when both dates are the same.",

            itemsRequired: "You must select at least one product or one combo.",
          },
        },

        maintenance: {
          loading: "Loading menu maintenance...",
          title: "Menu Maintenance",
          description: "Manage the menus registered in the system",
          newMenu: "New Menu",

          search: "Search menu...",
          allStatuses: "All statuses",
          total: "Total: {{count}} menus",

          id: "ID",
          menu: "Menu",
          start: "Start",
          end: "End",
          status: "Status",
          actions: "Actions",

          detail: "Details",
          edit: "Edit",
          enable: "Enable",
          disable: "Disable",
          saving: "Saving...",

          noResults: "No menus found",
          loadError: "Unable to load the menus.",

          confirmEnable: 'Do you want to enable the menu "{{name}}"?',
          confirmDisable: 'Do you want to disable the menu "{{name}}"?',

          enableSuccess: "The menu was enabled successfully.",
          disableSuccess: "The menu was disabled successfully.",
          statusError: "Unable to update the menu status.",
        },
      },

      processMaintenance: {
        title: "Process maintenance",
        description:
          "Manage the preparation processes associated with products.",

        newProcess: "New process",
        search: "Search by product...",
        product: "Product",
        stations: "Stations",
        actions: "Actions",

        detail: "Details",
        edit: "Edit",
        delete: "Delete",

        loadingError: "Unable to load the processes.",
        noResults: "No processes were found.",

        deleteDialog: {
          title: "Delete process",
          message:
            "Are you sure you want to delete the preparation process for {{product}}? This action will delete all of its steps.",
          cancel: "Cancel",
          delete: "Delete",
          deleting: "Deleting...",
          error: "Unable to delete the process.",
        },

        form: {
          product: "Product",
          stepsTitle: "Process steps",
          stepsDescription:
            "Select the station and estimated time for each step.",
          step: "Step {{number}}",
          station: "Station",
          estimatedTime: "Estimated time (minutes)",
          addStep: "Add step",
          save: "Save process",
          saving: "Saving...",

          createSuccess: "Process created successfully.",
          updateSuccess: "Process updated successfully.",
          deleteSuccess: "Process deleted successfully.",

          createError: "An error occurred while creating the process.",
          updateError: "An error occurred while updating the process.",
          deleteError: "An error occurred while deleting the process.",

          serverError: "Unable to communicate with the server.",

          loadOptionsError: "Unable to load products and stations.",

          validation: {
            product: "You must select a product.",
            minimumStep: "The process must have at least one station.",
            station: "You must select a station for every step.",
            time: "The estimated time must be greater than zero.",
          },

          saveError: "An error occurred while saving the process.",
        },

        create: {
          title: "Create process",
          description:
            "Select the product and define the stations that make up its preparation process.",
          button: "Create process",
          error: "Unable to create the process.",
        },

        update: {
          title: "Edit process",
          description:
            "Modify the stations and times of the preparation process.",
          button: "Update process",
          loadError: "Unable to load the process.",
          updateError: "Unable to update the process.",
        },
      },

      orders: {
        common: {
          back: "Back",
          cancel: "Cancel",
          client: "Customer",
          combo: "Combo",
          createdAt: "Creation date",
          date: "Date",
          delete: "Delete",
          deliveryMethod: "Delivery method",
          email: "Email",
          noNotes: "No notes.",
          noTracking: "No tracking",
          notes: "Notes",
          orderNumber: "Order #{{id}}",
          paymentMethod: "Payment method",
          product: "Product",
          productsAndCombos: "Products and combos",
          quantity: "Quantity: {{count}}",
          quantityLabel: "Quantity",
          save: "Save",
          saving: "Saving...",
          status: "Status",
          subtotal: "Subtotal",
          summary: "Summary",
          taxes: "Taxes",
          total: "Total",
        },

        create: {
          title: "New order",
          description:
            "Select an active menu and build the order by adding or removing products and combos.",
          viewHistory: "View history",
          loadingMenus: "Loading menus to create the order...",
          menu: "Menu",
          storePickup: "Store pickup",
          homeDelivery: "Delivery",
          loadingAddresses: "Loading addresses...",
          noSavedAddresses:
            "You have no saved addresses. You can select a location on the map below.",
          deliveryAddress: "Delivery address",
          location: "Location",
          unnamedAddress: "Unnamed address",
          mapInstruction: "Click the map to select a location",
          selectedLocation: "Selected location",
          saveAsAddress: "Save as address",
          mapHint: "Click the map to select a location",
          orderNotes: "Order notes",
          orderNotesPlaceholder:
            "Example: no onion, pack separately, pickup under Ana's name",
          characters500: "{{count}}/500 characters",
          characters300: "{{count}}/300 characters",
          start: "Start",
          end: "End",
          loadingMenuDetail: "Loading menu details...",
          remove: "Remove",
          add: "Add",
          inOrder: "{{count}} in order",
          summary: "Order summary",
          items: "{{count}} items",
          emptyCart: "You have not added any products or combos yet.",
          itemNote: "Note for {{type}}",
          itemNotePlaceholder: "Instructions for this product or combo",
          shipping: "Shipping",
          method: "Method",
          cash: "Cash",
          card: "Card",
          amountReceived: "Amount received",
          insufficientAmount: "The amount received is insufficient.",
          lastFourDigits: "Last 4 digits",
          lastFourDigitsHelp: "Enter only the last 4 digits.",
          submitting: "Submitting order...",
          confirm: "Confirm order",
          clearOrder: "Clear order",
          loginWarning:
            "You must log in to place the order. A default system customer is no longer used.",
          saveLocationTitle: "Save location as address",
          saveLocationDescription:
            'Enter a description or reference for this location (e.g. "Home", "Office", "123 Main Street").',
          addressDetails: "Address details",
          coordinates: "Coordinates",

          errors: {
            loadMenus: "Unable to load available menus.",
            loadMenu: "Unable to load the selected menu.",
            loadAddresses: "Unable to load saved addresses.",
            selectMapLocation: "First select a location on the map.",
            addressDescription:
              "Enter a description or reference for the address.",
            saveAddress: "Unable to save the address.",
            loginRequired: "You must log in to place an order.",
            menuRequired: "You must select a menu before creating the order.",
            itemRequired:
              "You must add at least one product or combo to the order.",
            addressRequired:
              "You must save the selected location as an address before continuing.",
            amountRequired: "You must enter the amount received.",
            insufficientAmount:
              "The amount received is insufficient to pay for the order.",
            cardBrandRequired: "You must select the card brand.",
            cardDigits: "You must enter exactly the last 4 digits of the card.",
            createOrder: "Unable to create the order.",
          },
        },

        list: {
          loading: "Loading orders...",
          loadError: "Unable to load the order history.",
          titles: {
            client: "My orders",
            staff: "Order management",
            default: "Order history",
          },
          descriptions: {
            client: "View your orders and access tracking for each one.",
            staff:
              "View customer orders and use the filters to find the information you need.",
            default: "View registered orders.",
          },
          newOrder: "New order",
          filters: {
            title: "History filters",
            all: "All",
            startDate: "Start date",
            endDate: "End date",
            clear: "Clear",
            showing: "Showing {{filtered}} of {{total}} orders.",
          },
          noResults: {
            title: "No orders match the current filters.",
            description:
              "Adjust the status or date range to view other orders.",
            create: "Create order",
          },
          items: "{{count}} items",
          created: "Created",
          lastMovement: "Last update",
          moreItems: "and {{count}} more items...",
          actions: {
            detail: "View details",
            tracking: "View tracking",
            repeat: "Repeat order",
          },
        },

        detail: {
          loading: "Loading order details...",
          loadError: "Unable to load the order.",
          unauthorized: "You are not authorized to view this order.",
          backToOrders: "Back to orders",
          notFound: "The requested order was not found.",
          description: "Complete order details.",
          viewInvoice: "View invoice",
          orderInfo: "Order information",
          generalNotes: "General notes",
          noItems: "This order has no registered items.",
          unitPrice: "Unit price",
        },

        invoice: {
          loading: "Loading invoice...",
          loadError: "Unable to load the invoice.",
          notFound: "Invoice not found.",
          title: "Invoice #{{id}}",
          generalInfo: "General information",
          manager: "Person in charge",
          notApplicable: "Not applicable",
          notRegistered: "Not registered",
          detailTitle: "Invoice details",
          noItems: "No registered items.",
          each: "each",
        },

        summary: {
          title: "Invoice summary",
          amountPaid: "Amount paid",
          change: "Change",
          brand: "Brand",
          card: "Card",
        },

        tracking: {
          orderRequired: "You must specify an order to view tracking.",
          loadError: "Unable to load tracking.",
          locationError: "Unable to load the driver's location.",
          demoError: "Unable to create the demo order.",
          loading: "Loading order tracking...",
          title: "Order tracking",
          description:
            "The status updates automatically every 5 seconds while the order is still in progress.",
          creatingDemo: "Creating...",
          createDemo: "Create demo",
          progress: "Progress",
          mapLocation: "Location on map",
          store: "La Tostelería (store)",
          deliveryAddress: "Delivery address",
          driver: "Driver",
          route: "of the route",
          driverPositionUpdates: "The driver's position updates every",
          seconds: "seconds",
          outForDelivery: "The order is out for delivery.",
          readyForPickup: "The order is ready for pickup.",
          history: "Order history",
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
