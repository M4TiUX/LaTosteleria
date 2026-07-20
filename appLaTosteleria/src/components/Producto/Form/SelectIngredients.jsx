import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

import {
  Autocomplete,
  CircularProgress,
  TextField,
} from "@mui/material";

import IngredientService from "../../../services/IngredientService";

export function SelectIngredients({ control, errors }) {
  const [ingredientes, setIngredientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    IngredientService.getIngredients()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setIngredientes(response.data);
        } else {
          setIngredientes([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar ingredientes:", error);
        setIngredientes([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <Controller
      name="ingredientes"
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple
          options={ingredientes}
          loading={cargando}
          value={ingredientes.filter((ingrediente) =>
            field.value?.includes(Number(ingrediente.id_ingrediente))
          )}
          getOptionLabel={(ingrediente) =>
            ingrediente.nombre_ingrediente ?? ""
          }
          isOptionEqualToValue={(option, value) =>
            Number(option.id_ingrediente) ===
            Number(value.id_ingrediente)
          }
          onChange={(_, valoresSeleccionados) => {
            field.onChange(
              valoresSeleccionados.map((ingrediente) =>
                Number(ingrediente.id_ingrediente)
              )
            );
          }}
          noOptionsText="No hay ingredientes disponibles"
          loadingText="Cargando ingredientes..."
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ingredientes"
              placeholder="Seleccione uno o varios ingredientes"
              error={Boolean(errors.ingredientes)}
              helperText={errors.ingredientes?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {cargando ? (
                      <CircularProgress size={20} />
                    ) : null}

                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
}