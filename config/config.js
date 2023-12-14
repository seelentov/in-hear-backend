const CONFIG = {
	secretJWT: process.env.SECRET_JWT,
	mongooseConnectionString:process.env.MONGOOSE_CONNECTION_STRING,
	port: process.env.PORT || '4444',
  domain: `https://in-hear-backend-production.up.railway.app`,
  cors:{
    origin: 'https://in-hear-react.vercel.app'
  }
}

export default CONFIG
