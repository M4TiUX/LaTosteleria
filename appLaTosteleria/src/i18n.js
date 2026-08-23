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
        mantenimientos: "Mantenimientos",
        usuarios: "Gestión de Usuarios",
      },

      user: {
        login: "Iniciar sesión",
        register: "Registrarse",
        logout: "Cerrar sesión",
      },

      auth: {
        login: {
          title: "Iniciar sesión",
          email: "Correo electrónico",
          password: "Contraseña",
          submit: "Ingresar",
          success: "Inicio de sesión exitoso.",
          serverInternalError:
            "Error interno del servidor. Contacte al administrador.",
          htmlError: "El servidor devolvió un error HTML.",
          invalidCredentials: "Credenciales incorrectas",
          error: "Error al iniciar sesión. Intente de nuevo.",
          unknownError: "Error desconocido",
          validation: {
            emailRequired: "El correo electrónico es obligatorio.",
            emailInvalid: "El correo electrónico no tiene un formato válido.",
            passwordRequired: "La contraseña es obligatoria.",
          },
        },

        signup: {
          title: "Registro de cliente",
          name: "Nombre",
          email: "Correo electrónico",
          password: "Contraseña",
          submit: "Registrarme",
          success: "Registro exitoso. Ahora puede iniciar sesión.",
          error: "No fue posible completar el registro.",
          validation: {
            nameRequired: "El nombre es obligatorio.",
            nameMin: "El nombre debe tener al menos 3 caracteres.",
            emailRequired: "El correo electrónico es obligatorio.",
            emailInvalid: "El correo electrónico no tiene un formato válido.",
            passwordRequired: "La contraseña es obligatoria.",
            passwordMin: "La contraseña debe tener al menos 8 caracteres.",
          },
        },
      },

      userManagement: {
        title: "Gestión de usuarios",
        adminDescription:
          "El Administrador puede consultar usuarios y crear cuentas de Empleado o Cocina.",
        employeeDescription:
          "El Empleado puede consultar usuarios, pero no gestionar roles privilegiados ni crear cuentas administrativas.",
        createUser: "Crear usuario",
        registeredUsers: "Usuarios registrados",
        name: "Nombre",
        email: "Correo",
        password: "Contraseña",
        role: "Rol",
        saving: "Guardando...",
        loading: "Cargando usuarios...",
        noUsers: "No hay usuarios para mostrar.",
        createSuccess: "Usuario creado correctamente.",
        roles: {
          employee: "Empleado",
          kitchen: "Cocina",
        },
        validation: {
          nameRequired: "El nombre es obligatorio.",
          nameMin: "El nombre debe tener al menos 3 caracteres.",
          nameMax: "El nombre no puede superar los 100 caracteres.",
          emailRequired: "El correo es obligatorio.",
          emailInvalid: "El correo no tiene un formato válido.",
          passwordRequired: "La contraseña es obligatoria.",
          passwordMin: "La contraseña debe tener al menos 8 caracteres.",
          roleRequired: "Debe seleccionar un rol.",
          roleAllowed: "Solo puede seleccionar Empleado o Cocina.",
        },
        errors: {
          operation: "No fue posible completar la operación.",
        },
      },

      dashboard: {
        title: "Dashboard",
        description:
          "Resumen en tiempo real basado en pedidos y detalles registrados en la base de datos.",
        referenceDate: "Fecha de referencia",
        evaluatedProducts: "Top productos evaluados",
        todayOrders: "Pedidos de hoy",
        topProducts: "Top 3 productos más vendidos",
        noSales: "No hay ventas para mostrar.",
        ordersByStatus: "Pedidos por estado del día actual",
        noOrdersToday: "No hay pedidos registrados hoy.",
        loadError: "No fue posible cargar el dashboard.",
      },

      publicProcesses: {
        title: "Procesos de Preparación",
        loading: "Cargando procesos...",
        detailLoading: "Cargando detalle...",
        connectionError: "Error al conectar con el servidor",
        station: "estación",
        stations: "estaciones",
        viewDetail: "Ver detalle",
        back: "Volver a procesos",
        inThisProcess: "en este proceso",
      },

      header: {
        myCart: "Mi carrito",
      },

      errors: {
        unauthorizedTitle: "Autorización",
        unauthorizedMessage: "Usuario no autorizado",
        notFoundTitle: "Recurso no encontrado",
        notFoundMessage:
          "La página que está buscando podría haber sido eliminada, haber cambiado de nombre o no estar disponible temporalmente.",
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
          serverError: "No fue posible comunicarse con el servidor.",

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
          success: "Menú creado correctamente.",
        },
        edit: {
          title: "Editar menú",
          description:
            "Actualice la disponibilidad y los elementos incluidos en el menú.",
          update: "Actualizar menú",
          loadError: "No fue posible cargar el menú solicitado.",
          updateError: "No fue posible actualizar el menú.",
          notFound: "No se encontró el menú solicitado.",
          success: "Menú actualizado correctamente.",
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
            "Si el menú no incluye combos, puede dejar esta selección vacía siempre que haya seleccionado al menos un producto.",

          save: "Guardar menú",
          saving: "Guardando...",

          menuImage: "Imagen del menú",
          imageDescription: "Seleccione una imagen relacionada con el menú.",
          selectImage: "Seleccionar imagen",
          selectedFile: "Archivo seleccionado: {{name}}",
          imagePreview: "Vista previa de la imagen",

          validation: {
            nameRequired: "El nombre del menú es obligatorio.",
            nameMin: "El nombre del menú debe tener al menos 3 caracteres.",
            nameMax: "El nombre del menú no puede superar los 100 caracteres.",

            startDateRequired: "La fecha de inicio es obligatoria.",
            startDateFormat:
              "La fecha de inicio debe utilizar el formato AAAA-MM-DD.",

            endDateRequired: "La fecha de fin es obligatoria.",
            endDateFormat:
              "La fecha de fin debe utilizar el formato AAAA-MM-DD.",

            dateRange:
              "La fecha de inicio no puede ser posterior a la fecha de fin.",

            startTimeRequired: "La hora de inicio es obligatoria.",
            startTimeFormat:
              "La hora de inicio debe utilizar el formato HH:MM.",

            endTimeRequired: "La hora de fin es obligatoria.",
            endTimeFormat: "La hora de fin debe utilizar el formato HH:MM.",

            timeRange:
              "La hora de inicio no puede ser posterior a la hora de fin cuando ambas fechas son iguales.",

            itemsRequired: "Debe seleccionar al menos un producto o un combo.",

            imageRequired: "Debe seleccionar una imagen para el menú.",

            imageType: "La imagen debe ser PNG, JPG, JPEG o WEBP.",

            nameNumeric:
              "El nombre del menú no puede contener únicamente números.",
          },
        },

        maintenance: {
          loading: "Cargando mantenimiento de menús...",
          title: "Mantenimiento de Menús",
          description: "Administre los menús registrados en el sistema",

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

          confirmEnable: '¿Desea habilitar el menú "{{name}}"?',

          confirmDisable: '¿Desea inhabilitar el menú "{{name}}"?',

          enableSuccess: "El menú fue habilitado correctamente.",

          disableSuccess: "El menú fue inhabilitado correctamente.",

          statusError: "No fue posible actualizar el estado del menú.",

          image: "Imagen",
        },
      },

      processMaintenance: {
        title: "Mantenimiento de Procesos",

        description:
          "Administre los procesos de preparación registrados en el sistema.",

        newProcess: "Nuevo proceso",

        search: "Buscar proceso...",

        product: "Producto",

        stations: "Estaciones",

        actions: "Acciones",

        detail: "Detalle",

        edit: "Editar",

        delete: "Eliminar",

        noResults: "No se encontraron procesos.",

        loadingError: "No fue posible cargar los procesos de preparación.",

        create: {
          title: "Crear proceso",

          description:
            "Complete la información necesaria para registrar un nuevo proceso de preparación.",

          button: "Crear proceso",
        },

        update: {
          title: "Editar proceso",

          description: "Modifique la información del proceso de preparación.",

          button: "Actualizar proceso",

          loadError: "No fue posible cargar el proceso de preparación.",
        },

        deleteDialog: {
          title: "Eliminar proceso",

          message:
            '¿Está seguro de que desea eliminar el proceso de "{{product}}"?',

          cancel: "Cancelar",

          delete: "Eliminar",

          deleting: "Eliminando...",
        },

        form: {
          product: "Producto",

          stepsTitle: "Pasos de preparación",

          stepsDescription:
            "Agregue las estaciones, el orden de los pasos y el tiempo estimado para completar el proceso.",

          step: "Paso {{number}}",

          station: "Estación",

          estimatedTime: "Tiempo estimado (minutos)",

          addStep: "Agregar paso",

          save: "Guardar proceso",

          saving: "Guardando...",

          loadOptionsError: "No fue posible cargar los productos o estaciones.",

          saveError: "No fue posible guardar el proceso.",

          createSuccess: "Proceso creado correctamente.",

          createError: "No fue posible crear el proceso.",

          updateSuccess: "Proceso actualizado correctamente.",

          updateError: "No fue posible actualizar el proceso.",

          deleteSuccess: "Proceso eliminado correctamente.",

          deleteError: "No fue posible eliminar el proceso.",

          serverError: "No fue posible comunicarse con el servidor.",

          validation: {
            product: "Debe seleccionar un producto.",

            minimumStep: "Debe agregar al menos un paso al proceso.",

            station: "Debe seleccionar una estación.",

            time: "El tiempo estimado debe ser mayor que cero.",
          },
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
          email: "Correo electrónico",
          noNotes: "Sin notas",
          noTracking: "Sin seguimiento",
          notes: "Notas",
          orderNumber: "Pedido #{{id}}",
          paymentMethod: "Método de pago",
          product: "Producto",
          productsAndCombos: "Productos y combos",
          quantityLabel: "Cantidad",
          save: "Guardar",
          saving: "Guardando...",
          status: "Estado",
          subtotal: "Subtotal",
          taxes: "Impuestos",
          total: "Total",
        },

        list: {
          titles: {
            client: "Mis pedidos",
            staff: "Administración de pedidos",
            default: "Pedidos",
          },

          descriptions: {
            client:
              "Consulte los pedidos que ha realizado y revise su estado actual.",
            staff:
              "Consulte los pedidos registrados por los clientes y utilice los filtros para localizar la información.",
            default: "Consulte los pedidos registrados en el sistema.",
          },

          newOrder: "Nuevo pedido",
          loading: "Cargando pedidos...",
          loadError: "No fue posible cargar los pedidos.",

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
              "Ajuste el estado o el rango de fechas para consultar otros pedidos.",
            create: "Crear pedido",
          },

          items: "{{count}} artículos",
          created: "Creado",
          lastMovement: "Último movimiento",
          moreItems: "+{{count}} artículos más",

          actions: {
            detail: "Ver detalle",
            tracking: "Seguimiento",
            repeat: "Nuevo pedido",
          },
        },

        create: {
          title: "Crear pedido",
          description:
            "Complete la información necesaria para registrar el pedido.",

          orderDateTime: "Fecha y hora del pedido",
          staffMember: "Funcionario encargado",
          customer: "Cliente",
          customerDetail: "Detalle del cliente",
          selectCustomer: "Seleccione un cliente",
          selectCustomerToContinue: "Seleccione un cliente para continuar.",

          menu: "Menú",
          loadingMenus: "Cargando menús...",
          loadingMenuDetail: "Cargando detalle del menú...",
          noAvailableMenus: "No hay menús disponibles en este momento.",

          start: "Inicio",
          end: "Fin",

          items: "Productos y combos",
          add: "Agregar",
          remove: "Eliminar",
          inOrder: "En el pedido",

          method: "Método de entrega",
          homeDelivery: "Entrega a domicilio",
          storePickup: "Retiro en tienda",

          deliveryAddress: "Dirección de entrega",
          loadingAddresses: "Cargando direcciones...",
          noSavedAddresses: "El cliente no tiene direcciones guardadas.",
          unnamedAddress: "Dirección sin nombre",

          addressDetails: "Detalles de la dirección",
          location: "Ubicación",
          coordinates: "Coordenadas",
          selectedLocation: "Ubicación seleccionada",

          mapHint: "Seleccione la ubicación de entrega en el mapa.",
          mapInstruction:
            "Haga clic en el mapa para seleccionar la ubicación exacta.",

          saveAsAddress: "Guardar como dirección",
          saveLocationTitle: "Nombre de la dirección",
          saveLocationDescription: "Descripción de la dirección",

          orderNotes: "Notas generales del pedido",
          orderNotesPlaceholder:
            "Agregue observaciones generales para el pedido.",
          itemNote: "Nota del artículo",
          itemNotePlaceholder: "Agregue una observación para este artículo.",

          characters300: "{{count}}/300 caracteres",
          characters500: "{{count}}/500 caracteres",

          cash: "Efectivo",
          card: "Tarjeta",

          amountReceived: "Monto recibido",
          payExactAmount: "Pagar monto exacto",
          insufficientAmount: "Monto insuficiente",

          lastFourDigits: "Últimos 4 dígitos",
          lastFourDigitsHelp:
            "Ingrese únicamente los últimos 4 dígitos de la tarjeta.",

          shipping: "Envío",

          summary: "Resumen del pedido",

          clearOrder: "Limpiar pedido",
          confirm: "Confirmar pedido",
          submitting: "Procesando pedido...",

          loginWarning: "Debe iniciar sesión para crear un pedido.",

          viewHistory: "Ver historial de pedidos",

          errors: {
            loginRequired: "Debe iniciar sesión para crear un pedido.",

            loadCustomers: "No fue posible cargar los clientes.",

            loadMenus: "No fue posible cargar los menús.",

            loadMenu: "No fue posible cargar el detalle del menú.",

            menuRequired: "Debe seleccionar un menú.",

            itemRequired: "Debe agregar al menos un producto o combo.",

            loadAddresses: "No fue posible cargar las direcciones.",

            addressRequired: "Debe seleccionar una dirección de entrega.",

            addressDescription:
              "Debe indicar una descripción para la dirección.",

            selectMapLocation: "Debe seleccionar una ubicación en el mapa.",

            saveAddress: "No fue posible guardar la dirección.",

            amountRequired: "Debe indicar el monto recibido.",

            insufficientAmount:
              "El monto recibido es insuficiente para cubrir el total.",

            cardBrandRequired: "Debe seleccionar la marca de la tarjeta.",

            cardDigits: "Debe ingresar los últimos 4 dígitos de la tarjeta.",

            createOrder: "No fue posible crear el pedido.",
          },
        },

        detail: {
          loading: "Cargando pedido...",
          loadError: "No fue posible cargar el pedido.",
          notFound: "Pedido no encontrado.",
          unauthorized: "No tiene permisos para consultar este pedido.",

          description:
            "Consulte la información general y el estado de preparación del pedido.",

          orderInfo: "Información del pedido",
          generalNotes: "Notas generales",

          preparationTitle: "Preparación del pedido",
          noPreparationStations:
            "No hay estaciones de preparación registradas.",

          preparationLoadError:
            "No fue posible cargar la información de preparación.",

          preparationUpdateError:
            "No fue posible actualizar el estado de preparación.",

          viewInvoice: "Ver factura",
          backToOrders: "Volver a pedidos",
        },

        summary: {
          title: "Resumen del pago",
          totalBeforeTax: "Total antes de impuestos",
          shippingCost: "Costo de envío",
          totalWithTax: "Total con impuestos",
          amountReceived: "Monto recibido",
          amountPaid: "Monto pagado",
          change: "Cambio",
          card: "Tarjeta",
          brand: "Marca",
        },

        invoice: {
          title: "Factura",
          detailTitle: "Detalle de la factura",
          generalInfo: "Información general",

          loading: "Cargando factura...",
          loadError: "No fue posible cargar la factura.",
          notFound: "Factura no encontrada.",

          manager: "Funcionario encargado",
          notApplicable: "No aplica",
          notRegistered: "No registrado",

          noItems: "No hay artículos registrados en esta factura.",

          linePrice: "Precio",
          lineSubtotal: "Subtotal",
          lineTax: "Impuesto",

          print: "Imprimir factura",
        },

        tracking: {
          title: "Seguimiento del pedido",

          description:
            "Consulte el progreso y la ubicación relacionada con la entrega del pedido.",

          loading: "Cargando seguimiento...",
          loadError: "No fue posible cargar el seguimiento del pedido.",

          progress: "Progreso",
          history: "Historial",

          store: "Tienda",
          deliveryAddress: "Dirección de entrega",
          mapLocation: "Ubicación en el mapa",
          route: "Ruta",

          driver: "Repartidor",
          driverPositionUpdates:
            "Actualizaciones de la ubicación del repartidor",

          readyForPickup: "Listo para retirar",
          outForDelivery: "En camino",

          advance: "Avanzar estado",
          updating: "Actualizando...",

          seconds: "{{count}} segundos",

          orderRequired: "Se requiere un pedido para consultar el seguimiento.",

          locationError: "No fue posible obtener la ubicación.",

          routeError: "No fue posible calcular la ruta.",

          updateError: "No fue posible actualizar el seguimiento.",

          createDemo: "Crear seguimiento de prueba",
          creatingDemo: "Creando seguimiento...",
          demoError: "No fue posible crear el seguimiento de prueba.",
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
        mantenimientoProcesos: "Process Management",
        menus: "Menus",
        pedidos: "Orders",
        mantenimientoMenus: "Menu Management",
        mantenimientoCombos: "Combo Management",
        mantenimientos: "Management",
        usuarios: "User Management",
      },

      user: {
        login: "Log in",
        register: "Register",
        logout: "Log out",
      },

      auth: {
        login: {
          title: "Log in",
          email: "Email",
          password: "Password",
          submit: "Log in",
          success: "Login successful.",
          serverInternalError:
            "Internal server error. Contact the administrator.",
          htmlError: "The server returned an HTML error.",
          invalidCredentials: "Invalid credentials",
          error: "Unable to log in. Please try again.",
          unknownError: "Unknown error",
          validation: {
            emailRequired: "Email is required.",
            emailInvalid: "Enter a valid email address.",
            passwordRequired: "Password is required.",
          },
        },

        signup: {
          title: "Customer registration",
          name: "Name",
          email: "Email",
          password: "Password",
          submit: "Register",
          success: "Registration successful. You can now log in.",
          error: "Unable to complete the registration.",
          validation: {
            nameRequired: "Name is required.",
            nameMin: "The name must contain at least 3 characters.",
            emailRequired: "Email is required.",
            emailInvalid: "Enter a valid email address.",
            passwordRequired: "Password is required.",
            passwordMin: "The password must contain at least 8 characters.",
          },
        },
      },

      userManagement: {
        title: "User Management",

        adminDescription:
          "The Administrator can view users and create Employee or Kitchen accounts.",

        employeeDescription:
          "The Employee can view users, but cannot manage privileged roles or create administrative accounts.",

        createUser: "Create user",
        registeredUsers: "Registered users",
        name: "Name",
        email: "Email",
        password: "Password",
        role: "Role",
        saving: "Saving...",
        loading: "Loading users...",
        noUsers: "There are no users to display.",
        createSuccess: "User created successfully.",

        roles: {
          employee: "Employee",
          kitchen: "Kitchen",
        },

        validation: {
          nameRequired: "Name is required.",
          nameMin: "The name must contain at least 3 characters.",
          nameMax: "The name cannot exceed 100 characters.",
          emailRequired: "Email is required.",
          emailInvalid: "Enter a valid email address.",
          passwordRequired: "Password is required.",
          passwordMin: "The password must contain at least 8 characters.",
          roleRequired: "You must select a role.",
          roleAllowed: "You can only select Employee or Kitchen.",
        },

        errors: {
          operation: "Unable to complete the operation.",
        },
      },

      dashboard: {
        title: "Dashboard",
        description:
          "Real-time summary based on orders and details registered in the database.",
        referenceDate: "Reference date",
        evaluatedProducts: "Top evaluated products",
        todayOrders: "Today's orders",
        topProducts: "Top 3 best-selling products",
        noSales: "There are no sales to display.",
        ordersByStatus: "Orders by status for the current day",
        noOrdersToday: "There are no orders registered today.",
        loadError: "Unable to load the dashboard.",
      },

      publicProcesses: {
        title: "Preparation Processes",
        loading: "Loading processes...",
        detailLoading: "Loading details...",
        connectionError: "Unable to connect to the server",
        station: "station",
        stations: "stations",
        viewDetail: "View details",
        back: "Back to processes",
        inThisProcess: "in this process",
      },

      header: {
        myCart: "My cart",
      },

      errors: {
        unauthorizedTitle: "Authorization",
        unauthorizedMessage: "Unauthorized user",
        notFoundTitle: "Resource not found",
        notFoundMessage:
          "The page you are looking for may have been removed, renamed, or temporarily unavailable.",
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
          serverError: "Unable to communicate with the server.",

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
          success: "Menu created successfully.",
        },
        edit: {
          title: "Edit menu",
          description:
            "Update the availability and the items included in the menu.",
          update: "Update menu",
          loadError: "Unable to load the requested menu.",
          updateError: "Unable to update the menu.",
          notFound: "The requested menu was not found.",
          success: "Menu updated successfully.",
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

          menuImage: "Menu image",
          imageDescription: "Select an image related to the menu.",
          selectImage: "Select image",
          selectedFile: "Selected file: {{name}}",
          imagePreview: "Image preview",

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

            imageRequired: "You must select an image for the menu.",

            imageType: "The image must be PNG, JPG, JPEG or WEBP.",

            nameNumeric: "The menu name cannot contain only numbers.",
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

          image: "Image",
        },
      },

      processMaintenance: {
        title: "Process Maintenance",

        description:
          "Manage the preparation processes registered in the system.",

        newProcess: "New process",

        search: "Search process...",

        product: "Product",

        stations: "Stations",

        actions: "Actions",

        detail: "Details",

        edit: "Edit",

        delete: "Delete",

        noResults: "No processes found.",

        loadingError: "Unable to load the preparation processes.",

        create: {
          title: "Create process",

          description:
            "Complete the required information to register a new preparation process.",

          button: "Create process",
        },

        update: {
          title: "Edit process",

          description: "Modify the preparation process information.",

          button: "Update process",

          loadError: "Unable to load the preparation process.",
        },

        deleteDialog: {
          title: "Delete process",

          message:
            'Are you sure you want to delete the process for "{{product}}"?',

          cancel: "Cancel",

          delete: "Delete",

          deleting: "Deleting...",
        },

        form: {
          product: "Product",

          stepsTitle: "Preparation steps",

          stepsDescription:
            "Add the stations, step order, and estimated time required to complete the process.",

          step: "Step {{number}}",

          station: "Station",

          estimatedTime: "Estimated time (minutes)",

          addStep: "Add step",

          save: "Save process",

          saving: "Saving...",

          loadOptionsError: "Unable to load the products or stations.",

          saveError: "Unable to save the process.",

          createSuccess: "Process created successfully.",

          createError: "Unable to create the process.",

          updateSuccess: "Process updated successfully.",

          updateError: "Unable to update the process.",

          deleteSuccess: "Process deleted successfully.",

          deleteError: "Unable to delete the process.",

          serverError: "Unable to communicate with the server.",

          validation: {
            product: "You must select a product.",

            minimumStep: "You must add at least one step to the process.",

            station: "You must select a station.",

            time: "The estimated time must be greater than zero.",
          },
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
          noNotes: "No notes",
          noTracking: "No tracking",
          notes: "Notes",
          orderNumber: "Order #{{id}}",
          paymentMethod: "Payment method",
          product: "Product",
          productsAndCombos: "Products and combos",
          quantityLabel: "Quantity",
          save: "Save",
          saving: "Saving...",
          status: "Status",
          subtotal: "Subtotal",
          taxes: "Taxes",
          total: "Total",
        },

        list: {
          titles: {
            client: "My orders",
            staff: "Order Management",
            default: "Orders",
          },

          descriptions: {
            client:
              "View the orders you have placed and check their current status.",
            staff:
              "View customer orders and use the filters to find the information you need.",
            default: "View the orders registered in the system.",
          },

          newOrder: "New order",
          loading: "Loading orders...",
          loadError: "Unable to load orders.",

          filters: {
            title: "History filters",
            all: "All",
            startDate: "Start date",
            endDate: "End date",
            clear: "Clear",
            showing: "Showing {{filtered}} of {{total}} orders.",
          },

          noResults: {
            title: "There are no orders matching the current filters.",
            description:
              "Adjust the status or date range to view other orders.",
            create: "Create order",
          },

          items: "{{count}} items",
          created: "Created",
          lastMovement: "Last movement",
          moreItems: "+{{count}} more items",

          actions: {
            detail: "View details",
            tracking: "Tracking",
            repeat: "New order",
          },
        },

        create: {
          title: "Create order",
          description:
            "Complete the required information to register the order.",

          orderDateTime: "Order date and time",
          staffMember: "Employee in charge",
          customer: "Customer",
          customerDetail: "Customer details",
          selectCustomer: "Select a customer",
          selectCustomerToContinue: "Select a customer to continue.",

          menu: "Menu",
          loadingMenus: "Loading menus...",
          loadingMenuDetail: "Loading menu details...",
          noAvailableMenus: "There are no menus available at this time.",

          start: "Start",
          end: "End",

          items: "Products and combos",
          add: "Add",
          remove: "Remove",
          inOrder: "In the order",

          method: "Delivery method",
          homeDelivery: "Home delivery",
          storePickup: "Store pickup",

          deliveryAddress: "Delivery address",
          loadingAddresses: "Loading addresses...",
          noSavedAddresses: "The customer has no saved addresses.",
          unnamedAddress: "Unnamed address",

          addressDetails: "Address details",
          location: "Location",
          coordinates: "Coordinates",
          selectedLocation: "Selected location",

          mapHint: "Select the delivery location on the map.",
          mapInstruction: "Click on the map to select the exact location.",

          saveAsAddress: "Save as address",
          saveLocationTitle: "Address name",
          saveLocationDescription: "Address description",

          orderNotes: "General order notes",
          orderNotesPlaceholder: "Add general notes for the order.",
          itemNote: "Item note",
          itemNotePlaceholder: "Add a note for this item.",

          characters300: "{{count}}/300 characters",
          characters500: "{{count}}/500 characters",

          cash: "Cash",
          card: "Card",

          amountReceived: "Amount received",
          payExactAmount: "Pay exact amount",
          insufficientAmount: "Insufficient amount",

          lastFourDigits: "Last 4 digits",
          lastFourDigitsHelp: "Enter only the last 4 digits of the card.",

          shipping: "Shipping",

          summary: "Order summary",

          clearOrder: "Clear order",
          confirm: "Confirm order",
          submitting: "Processing order...",

          loginWarning: "You must log in to create an order.",

          viewHistory: "View order history",

          errors: {
            loginRequired: "You must log in to create an order.",

            loadCustomers: "Unable to load customers.",

            loadMenus: "Unable to load menus.",

            loadMenu: "Unable to load the menu details.",

            menuRequired: "You must select a menu.",

            itemRequired: "You must add at least one product or combo.",

            loadAddresses: "Unable to load addresses.",

            addressRequired: "You must select a delivery address.",

            addressDescription: "You must enter an address description.",

            selectMapLocation: "You must select a location on the map.",

            saveAddress: "Unable to save the address.",

            amountRequired: "You must enter the amount received.",

            insufficientAmount:
              "The amount received is insufficient to cover the total.",

            cardBrandRequired: "You must select the card brand.",

            cardDigits: "You must enter the last 4 digits of the card.",

            createOrder: "Unable to create the order.",
          },
        },

        detail: {
          loading: "Loading order...",
          loadError: "Unable to load the order.",
          notFound: "Order not found.",
          unauthorized: "You do not have permission to view this order.",

          description:
            "View the general information and preparation status of the order.",

          orderInfo: "Order information",
          generalNotes: "General notes",

          preparationTitle: "Order preparation",
          noPreparationStations:
            "There are no preparation stations registered.",

          preparationLoadError: "Unable to load the preparation information.",

          preparationUpdateError: "Unable to update the preparation status.",

          viewInvoice: "View invoice",
          backToOrders: "Back to orders",
        },

        summary: {
          title: "Payment summary",
          totalBeforeTax: "Total before taxes",
          shippingCost: "Shipping cost",
          totalWithTax: "Total with taxes",
          amountReceived: "Amount received",
          amountPaid: "Amount paid",
          change: "Change",
          card: "Card",
          brand: "Brand",
        },

        invoice: {
          title: "Invoice",
          detailTitle: "Invoice details",
          generalInfo: "General information",

          loading: "Loading invoice...",
          loadError: "Unable to load the invoice.",
          notFound: "Invoice not found.",

          manager: "Employee in charge",
          notApplicable: "Not applicable",
          notRegistered: "Not registered",

          noItems: "There are no items registered on this invoice.",

          linePrice: "Price",
          lineSubtotal: "Subtotal",
          lineTax: "Tax",

          print: "Print invoice",
        },

        tracking: {
          title: "Order tracking",

          description:
            "View the progress and location related to the delivery of the order.",

          loading: "Loading tracking...",
          loadError: "Unable to load the order tracking.",

          progress: "Progress",
          history: "History",

          store: "Store",
          deliveryAddress: "Delivery address",
          mapLocation: "Map location",
          route: "Route",

          driver: "Driver",
          driverPositionUpdates: "Driver location updates",

          readyForPickup: "Ready for pickup",
          outForDelivery: "Out for delivery",

          advance: "Advance status",
          updating: "Updating...",

          seconds: "{{count}} seconds",

          orderRequired: "An order is required to view tracking.",

          locationError: "Unable to obtain the location.",

          routeError: "Unable to calculate the route.",

          updateError: "Unable to update the tracking.",

          createDemo: "Create test tracking",
          creatingDemo: "Creating tracking...",
          demoError: "Unable to create the test tracking.",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,

  lng: localStorage.getItem("language") || "es",

  fallbackLng: "es",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
