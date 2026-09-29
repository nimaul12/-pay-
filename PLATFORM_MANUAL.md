# টাকা পে (TakaPay) — Bangladesh Reward & Task Platform Manual

## ১. ওভারভিউ (Overview)
**টাকা পে (TakaPay)** একটি সম্পূর্ণ আধুনিক, সিকিউর এবং ফুল-স্ট্যাক বাংলাদেশ রিওয়ার্ড আর্নিং ওয়েব অ্যাপ্লিকেশন। এতে সাধারণ ব্যবহারকারীদের জন্য একটি ডেডিকেটেড মোবাইল-ফার্স্ট **ইউজার প্যানেল (User Panel)** এবং সকল কার্যক্রম ও পেমেন্ট নিয়ন্ত্রণের জন্য একটি পৃথক সুরক্ষিত **এডমিন প্যানেল (Admin Panel)** অন্তর্ভুক্ত রয়েছে।

---

## ২. এডমিন তথ্য ও লগইন ক্রেডেনশিয়াল (Official Admin Credentials)

- **এডমিনের নাম (Name):** `Niamul Molla`
- **ইউজারনেম (Username):** `niamul`
- **পাসওয়ার্ড (Password):** `22yyAa##22`
- **এডমিন উসার আইডি (Super Admin UID):** `TiERz9Z3dsUwUasAMAcxrkvy8hl2`
- **ইমেইল:** `funnymr976@gmail.com`

*লগইন স্ক্রিনে ইউজারনেম `niamul` এবং পাসওয়ার্ড `22yyAa##22` দিয়ে প্রবেশ করতে পারবেন, অথবা হেডার/লগইন মডাল থেকে সরাসরি "এডমিন (Niamul Molla)" বাটনে এক ক্লিকে এডমিন ড্যাশবোর্ডে প্রবেশ করা যাবে।*

---

## ৩. সক্রিয় বিজ্ঞাপন নেটওয়ার্ক কোডসমূহ (Configured Live Advertisements)

অ্যাপ্লিকেশনের বিভিন্ন প্লেসমেন্টে আপনার প্রদত্ত সকল Adsterra / CPM নেটওয়ার্কের অ্যাড স্ক্রিপ্ট এবং ডিরেক্ট লিংকসমূহ সফলভাবে যুক্ত করা হয়েছে:

### ১. হেডার ব্যানার (728x90 Leaderboard Banner):
- **প্লেসমেন্ট:** `banner_top`
- **কোড:**
```html
<script type="text/javascript">
atOptions = {
'key' : 'd8193cfa215118c7368da35f7807f650',
'format' : 'iframe',
'height' : 90,
'width' : 728,
'params' : {}
};
</script>
<script type="text/javascript" src="https://www.highrevenueformat.com/d8193cfa215118c7368da35f7807f650/invoke.js"></script>
```

### ২. ড্যাশবোর্ড ব্যানার (320x50 Mobile Banner):
- **প্লেসমেন্ট:** `dashboard`
- **কোড:**
```html
<script type="text/javascript">
atOptions = {
'key' : 'dd04c37faba4081d4e7b8d8fb928084f',
'format' : 'iframe',
'height' : 50,
'width' : 320,
'params' : {}
};
</script>
<script type="text/javascript" src="https://www.highrevenueformat.com/dd04c37faba4081d4e7b8d8fb928084f/invoke.js"></script>
```

### ৩. টাস্ক প্রি-রোল অ্যাড (160x300 Skyscraper Banner & 10s Countdown):
- **প্লেসমেন্ট:** `task_preroll` (প্রতিটি টাস্ক শুরুর আগে বাধ্যতামূলক ১০ সেকেন্ড দেখানো হয়)
- **কোড:**
```html
<script type="text/javascript">
atOptions = {
'key' : 'a113ec9c7a1334fece6380e5b5d6ff6c',
'format' : 'iframe',
'height' : 300,
'width' : 160,
'params' : {}
};
</script>
<script type="text/javascript" src="https://www.highrevenueformat.com/a113ec9c7a1334fece6380e5b5d6ff6c/invoke.js"></script>
```
- **টার্গেট ডিরেক্ট লিংক:** `https://www.profitableratecpmnetwork.com/pbt2uwgcaf?key=be8f8a3b7099681eb48e151cfdf2c0f1`

### ৪. নেটিভ ব্যানার কন্টেইনার (Native Container Ad):
- **প্লেসমেন্ট:** `banner_bottom`
- **কোড:**
```html
<script async="async" data-cfasync="false" src="https://pl31315955.profitableratecpmnetwork.com/8c7f3da0e0eba23ec26c2cd0de762e2c/invoke.js"></script>
<div id="container-8c7f3da0e0eba23ec26c2cd0de762e2c"></div>
```

### ৫. সোশ্যাল বার নোটিফিকেশন স্ক্রিপ্ট (Social Bar Notification):
- **স্ক্রিপ্ট:**
```html
<script src="https://pl31315953.profitableratecpmnetwork.com/0a/06/55/0a065518953dacf835058902cf937356.js"></script>
```

### ৬. পপ-আন্ডার ও স্মার্ট লিংক স্ক্রিপ্ট (Popunder & CPM Links):
- **স্ক্রিপ্ট:**
```html
<script src="https://pl31315956.profitableratecpmnetwork.com/bb/93/c9/bb93c9bcf3eb77f0a05e5ece073c48d0.js"></script>
```
- **ডিরেক্ট লিংক ২:** `https://www.profitableratecpmnetwork.com/qkkgviynkn?key=3dbb5f7d53b52dac9fbb07dcc8565934`

---

## ৪. কীভাবে নতুন বিজ্ঞাপন কোড পরিবর্তন করবেন? (Managing Ads from Admin Panel)
1. এডমিন প্যানেলে প্রবেশ করুন -> বাম মেনু থেকে **"বিজ্ঞাপন সেটিংস (Ads)"**-এ ক্লিক করুন।
2. যেকোনো বিজ্ঞাপনের পাশে থাকা **"এডিট কোড"** বাটনে চাপুন।
3. আপনার নতুন কোড বা লিংক পেস্ট করে **"সংরক্ষণ করুন"**-এ ক্লিক করলেই তাৎক্ষণিক ওয়েবসাইটে চালু হয়ে যাবে।

---

## ৫. টাস্ক রিওয়ার্ড ও টাইমার কীভাবে পরিবর্তন করবেন? (How to Change Task Rewards)
1. এডমিন প্যানেলে **"টাস্ক পরিচালনা (Tasks)"** পেজে যান।
2. নতুন টাস্ক যোগ করতে **"নতুন টাস্ক তৈরি করুন"** বাটনে চাপুন অথবা বিদ্যমান টাস্কের পাশে **এডিট (পেন্সিল আইকন)** চাপুন।
3. ফর্মের ফিল্ডগুলো পরিবর্তন করুন:
   - **রিওয়ার্ড (৳ BDT):** যেমন ৫ টাকা, ১০ টাকা বা ২০ টাকা।
   - **টাইমার (সেকেন্ড):** যেমন ৩০ সেকেন্ড, ৪৫ সেকেন্ড বা ৬০ সেকেন্ড।
   - **দৈনিক লিমিট:** একজন ইউজার দিনে কতবার করতে পারবে।
   - **বাধ্যতামূলক প্রি-রোল বিজ্ঞাপন (১০ সেকেন্ড কাউন্টডাউন):** টিক দিয়ে সক্রিয় রাখুন।
4. **"আপডেট সংরক্ষণ করুন"** বাটনে চাপলেই তাৎক্ষণিকভাবে ইউজার প্যানেলে পরিবর্তন কার্যকর হবে।

---

## ৬. বিকাশ ও নগদ উইথড্রয়াল অনুমোদন প্রক্রিয়া (Processing Withdrawals)
1. এডমিন প্যানেলে **"উইথড্রয়াল অনুমোদন (Withdrawals)"** পেজে যান।
2. গ্রাহকের নম্বরে উল্লিখিত নেট পরিমাণ টাকা বিকাশ/নগদ অ্যাপ দিয়ে পাঠিয়ে দিয়ে রিকোয়েস্টের পাশে **"পেইড মার্ক"** বাটনে চাপুন।
3. বিকাশ/নগদের ট্রানজেকশন আইডি (TxID) লিখে সাবমিট করলেই রিকোয়েস্ট পেইড হয়ে যাবে।
4. কোনো ভুল নম্বরের ক্ষেত্রে **"বাতিল ও রিফান্ড"** বাটনে চাপলে স্বয়ংক্রিয়ভাবে গ্রাহকের টাকা তার ওয়ালেটে ফেরত চলে যাবে।
