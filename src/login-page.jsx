import React, { useState } from 'react';
import { Layout, useLogin, useNotify } from 'react-admin';
import { TextField, Button, Stack } from '@mui/material';


export default function LoginPage() {
  const [tokenValue, setTokenValue] = useState("averysecureauthkey");

  function handleChange(event) {
    setTokenValue(event.target.value);
  }

  const login = useLogin();
  const notify = useNotify();

  function handleSubmit(event) {
    event.preventDefault();
    const token = event.target.token.value;
    login(token).catch(error => {
      notify(error);
    });
  }

  return <Layout>
    <form onSubmit={handleSubmit}>
      <div style={{width: "400px"}}>
        <h1>Admin login</h1>
        <Stack direction="column" spacing={2}>
          <TextField
            name="token"
            type="text"
            placeholder="token"
            value={tokenValue}
            label="Authentication Token"
            variant="filled"
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
          >Login</Button>
        </Stack>
      </div>
    </form>
  </Layout>
}
