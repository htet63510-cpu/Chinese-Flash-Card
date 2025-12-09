# Base Image အဖြစ် Node.js ကို သုံးခြင်း
FROM node:18-slim

# Working Directory သတ်မှတ်ခြင်း
WORKDIR /app

# package.json ကို ကူးထည့်ပြီး Dependencies သွင်းခြင်း
# Production Dependencies များကိုသာ သွင်းရန် (Build အတွက် မဟုတ်)
COPY package*.json ./
RUN npm install --omit=dev

# Vite Project ၏ Frontend Static Files များကို Build လုပ်ခြင်း
# package.json ထဲမှာ 'build' script ရှိရန် လိုအပ်ပါသည်။
RUN npm run build 

# Server Code အပါအဝင် ကျန် Code အားလုံးကို ကူးထည့်ခြင်း
COPY . .

# Server ကို စတင် Run မည့် Command
# (server.js အစား server.cjs နာမည်ပြောင်းထားရင်၊ ဒီနေရာမှာလည်း server.cjs လို့ ပြောင်းရပါမယ်။)
CMD ["node", "server.cjs"]