
function About() {
  const values = [
    {
      title: "Kalite İlkesi",
      description:
        "Tüm ürünlerimizde en iyi ham maddeler kullanarak, müşterilerimize en yüksek kalitede hizmet sunuyoruz.",
    },
    {
      title: "Müşteri Odaklılık",
      description:
        "Her müşteri bizim için önemlidir. Onların ihtiyaçlarını anlamak ve karşılamak bizim sorumluluğumuzdur.",
    },
    {
      title: "İnovasyon",
      description:
        "Sürekli gelişim ve yenilik, CafeSystem'in başarısının anahtarıdır. Trend takip ederken kendi tarzımızı koruyoruz.",
    },
    {
      title: "Sosyal Sorumluluk",
      description: "Toplumun gelişimine katkı sağlamak ve etik değerleri gözetmek bizim kimliğimizin parçasıdır.",
    },
    {
      title: "Ekip Çalışması",
      description: "Çalışanlarımız bizim en büyük varlığımız. Onların gelişimini desteklemek bizim önceliğimizdir.",
    },
    {
      title: "Sürdürülebilirlik",
      description: "Çevre dostu uygulamalarla, gelecek kuşaklara daha iyi bir dünya bırakma sorumluluğunu taşıyoruz.",
    },
  ]
  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Genel Müdür",
      image: "https://placeholder.svg?height=300&width=300&query=professional-man-1",
    },
    {
      name: "Fatma Demir",
      role: "Operasyon Müdürü",
      image: "https://placeholder.svg?height=300&width=300&query=professional-woman-1",
    },
    {
      name: "Mehmet Çelik",
      role: "Şef Aşçı",
      image: "https://placeholder.svg?height=300&width=300&query=professional-man-2",
    },
  ]
  return (
    <>

    {/*    <section
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://placeholder.svg?height=1080&width=1920&query=luxury-cafe-interior')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="max-w-2xl">
            <div className="inline-block bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">
              Hakkımızda
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Taviz Vermeden Temek Deneyimi Yaşayın
            </h1>
            <p className="text-lg text-gray-100 mb-8 max-w-xl">
              Gurmetin tadını ve konforun cazibesini bir araya getirerek, her anı unutulmaz kılıyoruz.
            </p>
            <div className="flex gap-4">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                Hikayemizi Keşfedin
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
              >
                İletişime Geçin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
 */}

  
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://placeholder.svg?height=500&width=500&query=cafe-atmosphere"
                alt="CafeSystem Hikayesi"
                className="rounded-lg w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-foreground">CafeSystem'in</span>
                <span className="text-orange-600"> Hikayesi</span>
              </h2>
              <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                2015 yılında kurulan CafeSystem, sadece bir kafe değil, bir yaşam tarzıdır. İlk gün kapılarımızı açtığımız
                günden itibaren, müşteri memnuniyeti ve kaliteli hizmet sunmak bizim temel amacımız olmuştur.
              </p>
              <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                Başlangıçta küçük bir mekan olan CafeSystem, bugün Türkiye'nin dört bir yanında şubelerine sahip bir marka
                haline gelmiştir. Her bir şubemizde, aynı samimi ortam ve hizmet kalitesi sizi karşılamaktadır.
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Misyonumuz basit ama güçlü: "Her ziyaretçiyi aile üyesi gibi karşılamak ve onlara unutulmaz bir deneyim
                yaşatmak."
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 md:py-24 bg-foreground/5">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">CafeSystem'in</span>
              <span className="text-orange-600"> Değerleri</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Kurumsal değerlerimiz, her kararımız ve eylemimizin temelini oluşturur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-background rounded-xl p-8 border border-border hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4 text-foreground">{value.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Lider</span>
              <span className="text-orange-600"> Kadromuz</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Uzman ve deneyimli ekibimiz, her gün en iyi hizmeti sunmak için çalışmaktadır.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 overflow-hidden rounded-xl">
                  <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-80 object-cover" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                <p className="text-orange-600 font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* <section className="py-16 md:py-24 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Mükkemelliyeti Deneyimlemeye Hazır mısınız?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            CafeSystem ailemize katılın ve her ziyaretiyle siz de unutulmaz anılar biriktirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Masa Ayırt
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold bg-transparent"
            >
              İletişime Geçin
            </Button>
          </div>
        </div>
      </section> */}
    </>
  )
}

export default About