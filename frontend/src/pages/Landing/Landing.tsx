export default function Landing() {
  return (
    <div className="w-full font-sans">
      {/* KAHRAMAN (HERO) BÖLÜMÜ */}
      {/* Arka plan görseli üzerine metin için genel olarak koyu veya görselin kontrastına uygun renkler seçildi. */}
      <section className="relative bg-cover bg-center bg-no-repeat h-[90vh] flex items-center px-6 md:px-20" style={{
        backgroundImage: "url('/interior1.png')"
      }}>
        <div className="max-w-2xl text-white">
          <p className="bg-orange-600 text-sm px-3 py-1 rounded-full inline-block mb-4">Ayrıcalıklı Kafe Deneyimi</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Taviz Vermeden <span className="text-orange-500">Olağanüstü</span> Yemek <br /> Deneyimi Yaşayın
          </h1>


          <p className="mt-4 text-gray-200">
            CafeSystem, modern ve atmosferik bir ortamda özenle seçilmiş gurme yemekler ve özel içeceklerden oluşan bir menü sunar.
          </p>


          <div className="flex items-center gap-4 mt-6">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg">Menümüzü Keşfet</button>
            <button className="bg-white text-black px-6 py-3 rounded-lg shadow">Masa Ayırt</button>
          </div>
        </div>
      </section>

      {/* NEDEN BİZİ SEÇMELİSİNİZ */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Neden <span className="text-orange-600">CafeSystem</span>'i Seçmelisiniz?
        </h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          Unutulmaz bir yemek deneyimi sunmak için mutfak mükemmelliğini modern kolaylıkla birleştiriyoruz.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
          {[
            {
              title: "Çiftlikten Sofraya Taze",
              desc: "Tüm malzemeler en yüksek tazeliği sağlamak için sürdürülebilir ortaklardan temin edilir.",
            },
            {
              title: "Ödüllü Şefler",
              desc: "Mutfak ekibimiz, onlarca yıllık Michelin yıldızlı deneyime sahiptir.",
            },
            {
              title: "Her Gün Açık",
              desc: "Haftanın 7 günü kahvaltı, öğle yemeği ve akşam yemeği hizmeti.",
            },
            {
              title: "Kolay Rezervasyon",
              desc: "Online sistemimiz sayesinde masanızı saniyeler içinde ayırtın.",
            },
            {
              title: "Özel Şarap Listesi",
              desc: "Uzman sommelier'ler tarafından seçilmiş 200'den fazla şarap.",
            },
            {
              title: "Diyetlere Uygun Seçenekler",
              desc: "Vegan, glütensiz ve diğer özel beslenme gereksinimlerine uygun seçenekler.",
            }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white shadow rounded-xl text-left">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ÖNE ÇIKAN YEMEKLER */}
      <section className="py-20 px-6 md:px-20 bg-black text-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Öne Çıkan <span className="text-orange-600">Yemekler</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-6xl mx-auto">
          {[
            {
              name: "Izgara Somon Lezzeti",
              price: 28,
              img: "/dish1.jpg",
            },
            {
              name: "Akdeniz Ziyafeti",
              price: 24,
              img: "/dish2.jpg",
            },
            {
              name: "Özel Tadım Menüsü",
              price: 65,
              img: "/dish3.jpg",
            }
          ].map((dish, index) => (
            <div key={index} className="bg-white text-black rounded-xl overflow-hidden shadow">
              <img src={dish.img} alt={dish.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{dish.name}</h3>
                <p className="text-orange-600 font-bold mt-2">${dish.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">Tüm Menüyü Gör</button>
        </div>
      </section>

      {/* DENEYİM BÖLÜMÜ */}
      <section className="py-20 px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-orange-600">Unutulmaz</span> Anlar İçin Tasarlandı
            </h2>
            <p className="mt-4 text-gray-600">
              Modern iç mekanımız, ister akşam yemeği, ister iş yemeği, isterse de rahat bir buluşma için olsun, mükemmel bir atmosfer sağlar.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li>• Mükemmel bir ruh hali için ambiyans aydınlatması</li>
              <li>• Hafta boyunca özenle seçilmiş müzik listesi</li>
              <li>• Lüks oturma düzeni ve ferah alanlar</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img src="/interior1.png" alt="İç Mekan 1" className="rounded-xl h-48 object-cover w-full" />
            <img src="/interior2.png" alt="İç Mekan 2" className="rounded-xl h-48 object-cover w-full" />
            <img src="/interior3.png" alt="İç Mekan 3" className="rounded-xl h-48 object-cover col-span-2 w-full" />
          </div>
        </div>
      </section>

      <section className="py-20 text-center bg-gradient-to-b from-[#FF4A1C] via-[#FF7A28] to-[#FFB200] text-white px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-bold">Mükemmelliği Deneyimlemeye Hazır mısınız?</h2>
        <p className="mt-2 max-w-xl mx-auto">
          Hemen masanızı ayırtın ve CafeSystem'i neden unutulmaz yemekler için tercih ettiğinizi keşfedin.
        </p>


        <div className="flex gap-4 justify-center mt-6">
          <button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100">Masanızı Ayırtın</button>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900">Menüye Göz Atın</button>
        </div>
      </section>
    </div>
  );
}