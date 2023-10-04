import express from 'express';
import oauth2 from 'node-oauth2-server'
import OAuth2Server from'oauth2-server';
import bodyParser from'body-parser';

const express = require('express');
const oauth2orize = require('oauth2orize');
const passport = require('passport');
const BasicStrategy = require('passport-http-bearer').Strategy;

const app = express();
const server = oauth2orize.createServer();

// Simulação de armazenamento de aplicativos clientes e tokens (não recomendado para produção)
const clients = [
  { clientId: 'sjdueos8dne2s', clientSecret: 'dmos902nd1sm10', grants: ['client_credentials'] },
];

const tokens = [];

// Middleware para autenticar o cliente com base nas credenciais do cliente
passport.use(new BasicStrategy((clientId, clientSecret, done) => {
  const client = clients.find((c) => c.clientId === clientId && c.clientSecret === clientSecret);
  if (!client) {
    return done(null, false);
  }
  return done(null, client);
}));

// Middleware para emitir tokens de acesso
server.exchange(
  oauth2orize.exchange.clientCredentials((client, scope, done) => {
    const token = generateToken();
    tokens.push({ token, client });
    return done(null, token);
  })
);

// Função para gerar tokens de acesso simples (não use isso em produção)
function generateToken() {
  return Math.random().toString(36).substring(2);
}

// Configuração de middleware
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(server.token());

// Rota para emissão de tokens de acesso
app.post('/oauth/token', passport.authenticate('basic', { session: false }), server.token());

// Rota protegida com autenticação OAuth2
app.get('/api/some-protected-endpoint', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.json({ message: 'Recursos protegidos acessados com sucesso.' });
});

app.listen(3000, () => {
  console.log('Servidor OAuth 2.0 em execução na porta 3000');
});