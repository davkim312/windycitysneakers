import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const InputForm = ({ name, label, required }) => {

    const { control } = useFormContext();
    
    return (
        <Grid item xs={12} sm={6}>
            <Controller
                control={control} // getting 'control' from above const
                name={name} // getting 'name', 'label', and 'required' through props
                render={({field}) => (
                    <TextField fullWidth label={label} required={required} />
                )}
            />
        </Grid>
    )
};

export default InputForm;