# 🌤️ Dashboard do Tempo

Uma aplicação moderna para monitoramento de condições meteorológicas com dados em tempo real.

## ✨ Características

- **Interface moderna e responsiva** - Design limpo e intuitivo
- **Dados em tempo real** - Informações meteorológicas atualizadas
- **Múltiplas cidades** - Acompanhe várias localidades simultaneamente
- **Busca inteligente** - Sistema de geocoding para encontrar cidades
- **Previsão estendida** - Dados para os próximos 7 dias
- **Totalmente gratuito** - Sem necessidade de API keys ou limites

## 🏆 API de Dados Meteorológicos

Esta aplicação utiliza a **Open-Meteo** como fonte de dados meteorológicos:

### 🌟 Open-Meteo

- ✅ **Totalmente gratuita**
- ✅ **Sem necessidade de API key**
- ✅ **Sem limite de requisições**
- ✅ **Dados precisos e atualizados**
- ✅ **Suporte a múltiplos idiomas**
- 🌐 **Site:** https://open-meteo.com/

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework de CSS utilitário
- **React Query** - Gerenciamento de estado e cache de dados
- **Axios** - Cliente HTTP para requisições
- **React Icons** - Biblioteca de ícones
- **Jest** - Framework de testes

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd dashboard-tempo
```

2. Instale as dependências:

```bash
npm install
```

3. Execute a aplicação:

```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
├── components/          # Componentes React reutilizáveis
├── hooks/              # Custom hooks
├── services/           # Serviços de API
├── types/              # Definições de tipos TypeScript
├── config/             # Configurações da aplicação
└── providers/          # Context providers
```

## 🌡️ Funcionalidades

### Dados Meteorológicos

- Temperatura atual e sensação térmica
- Umidade relativa do ar
- Pressão atmosférica
- Velocidade e direção do vento
- Precipitação atual
- Cobertura de nuvens

### Previsão do Tempo

- Previsão de 7 dias
- Temperaturas máximas e mínimas
- Probabilidade de precipitação
- Códigos de condições meteorológicas

### Interface

- Cards responsivos para cada cidade
- Sistema de busca com sugestões
- Atualização automática dos dados
- Indicadores de carregamento e erro
- Design otimizado para mobile e desktop

## 🛠️ Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
