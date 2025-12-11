import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter, Youtube } from "lucide-react"

function Contact() {
    return (
        <>
            <section className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-balance">İletişime Geçin</h1>
                    <p className="text-orange-100 mt-2">Bizimle her zaman iletişime geçebilirsiniz.</p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                        {/* Sol: Harita */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Bizi Burada Bulabilirsiniz</h2>
                            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-border">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a327aecf12d%3A0x1234567890abcdef!2s123%20Cafe%20Street!5e0!3m2!1sen!2sus!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="CafeSystem Konum"
                                />
                            </div>
                        </div>

                        {/* Sağ: İletişim Bilgileri */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-foreground mb-6">İletişim Bilgileri</h2>

                            {/* Bilgiler */}
                            <div className="space-y-6 mb-8">

                                {/* Adres */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-orange-600 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Adres</h3>
                                        <p className="text-foreground/70">123 Cafe Street, Downtown</p>
                                        <p className="text-foreground/70">New York, NY 10001</p>
                                    </div>
                                </div>

                                {/* Telefon */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Phone className="w-6 h-6 text-orange-600 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Telefon</h3>
                                        <p className="text-foreground/70">+1 (555) 123-4567</p>
                                        <p className="text-foreground/70 text-sm">Hafta içi & Hafta sonu: 09:00 - 23:00</p>
                                    </div>
                                </div>

                                {/* E-posta */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Mail className="w-6 h-6 text-orange-600 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">E-posta</h3>
                                        <p className="text-foreground/70">info@cafesystem.com</p>
                                        <p className="text-foreground/70">support@cafesystem.com</p>
                                    </div>
                                </div>

                                {/* Çalışma Saatleri */}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Clock className="w-6 h-6 text-orange-600 mt-1" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Çalışma Saatleri</h3>
                                        <p className="text-foreground/70">Pazartesi - Cuma: 09:00 - 23:00</p>
                                        <p className="text-foreground/70">Cumartesi - Pazar: 08:00 - 00:00</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sosyal Medya */}
                            <div className="border-t border-border pt-8">
                                <h3 className="font-semibold text-foreground mb-4">Bizi Takip Edin</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 transition flex items-center justify-center text-white"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>

                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 transition flex items-center justify-center text-white"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>

                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 transition flex items-center justify-center text-white"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>

                                    <a
                                        href="https://youtube.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 transition flex items-center justify-center text-white"
                                    >
                                        <Youtube className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section></>
    )
}

export default Contact