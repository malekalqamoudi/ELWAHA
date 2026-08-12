// ================================================================
// DOM READY
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. HAMBURGER
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ============================================================
    // 2. STICKY NAVBAR + BACK TO TOP
    // ============================================================
    const header = document.getElementById('header');
    const backBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (backBtn) {
            currentScroll > 400 ? backBtn.classList.add('visible') : backBtn.classList.remove('visible');
        }
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // 3. TESTIMONIALS SLIDER
    // ============================================================
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const slides = track.querySelectorAll('.testimonial-card');
        const totalSlides = slides.length;
        let currentIndex = 0;

        function getSlidesPerView() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        }

        function updateSlider() {
            const slidesPerView = getSlidesPerView();
            const slideWidth = track.parentElement.offsetWidth / slidesPerView;
            const gap = 30;
            const offset = currentIndex * (slideWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;

            const dots = dotsContainer.querySelectorAll('span');
            const totalDots = Math.ceil(totalSlides / slidesPerView);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === Math.floor(currentIndex / slidesPerView));
            });
        }

        function createDots() {
            const totalDots = Math.ceil(totalSlides / getSlidesPerView());
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.dataset.index = i;
                dot.addEventListener('click', () => {
                    currentIndex = i * getSlidesPerView();
                    if (currentIndex >= totalSlides) currentIndex = totalSlides - 1;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
            updateSlider();
        }

        prevBtn.addEventListener('click', () => {
            const step = getSlidesPerView();
            currentIndex = Math.max(0, currentIndex - step);
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            const step = getSlidesPerView();
            const maxIndex = totalSlides - 1;
            currentIndex = Math.min(maxIndex, currentIndex + step);
            updateSlider();
        });

        window.addEventListener('resize', () => {
            createDots();
            updateSlider();
        });

        createDots();
    }

    // ============================================================
    // 4. SCROLL REVEAL
    // ============================================================
    const revealElements = document.querySelectorAll(
        '.product-card, .why-item, .testimonial-card, .gallery-item, ' +
        '.about-grid > *, .contact-grid > *, .mission-item, ' +
        '.service-card, .brand-item, .stat-item, .faq-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ============================================================
    // 5. COUNTERS (Stats)
    // ============================================================
    const counters = document.querySelectorAll('.stat-number, .why-number');
    let countersStarted = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            if (isNaN(target)) return;
            let current = 0;
            const increment = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = current;
                }
            }, 25);
        });
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.about-stats') || document.querySelector('.why');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // ============================================================
    // 6. FAQ ACCORDION
    // ============================================================
    const faqQuestions = document.querySelectorAll('[data-faq]');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parent = question.parentElement;
            const isActive = parent.classList.contains('active');
            // Close all others
            faqQuestions.forEach(q => q.parentElement.classList.remove('active'));
            if (!isActive) {
                parent.classList.add('active');
            }
        });
    });

    // ============================================================
    // 7. LANGUAGE TOGGLE
    // ============================================================
    const langToggle = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');
    const html = document.documentElement;
    let currentLang = 'ar';

    const translations = {
        ar: {
            nav_about: 'من نحن',
            nav_brands: 'الماركات',
            nav_products: 'منتجاتنا',
            nav_services: 'خدماتنا',
            nav_why: 'لماذا نحن',
            nav_testimonials: 'آراء العملاء',
            nav_gallery: 'المعرض',
            nav_faq: 'الأسئلة',
            nav_contact: 'تواصل معنا',
            nav_contact_btn: 'تواصل معنا',
            hero_badge: '🇱🇾 الوكيل الحصري في ليبيا',
            hero_title: 'أفضل الأجهزة الكهرومنزلية<br />بجودة <span class="gold">تفوق التوقعات</span>',
            hero_desc: 'نقدم لكم أحدث الموديلات من أفضل الماركات العالمية، مع ضمان الجودة وخدمة ما بعد البيع.',
            hero_btn_products: 'استكشف منتجاتنا',
            hero_btn_contact: 'تواصل معنا',
            about_tag: 'تعرف علينا',
            about_title: 'من نحن',
            about_subtitle: 'شركة الواحة الجديدة .. جودة تليق بمنزلك',
            about_exp: 'سنوات من الخبرة',
            about_heading: 'شريكك الموثوق في عالم الأجهزة المنزلية',
            about_p1: 'تأسست شركة الواحة الجديدة عام 2008 لتكون الوكيل الحصري لأكبر الماركات العالمية في مجال الأجهزة الكهرومنزلية في ليبيا. منذ ذلك الحين ونحن نلتزم بتقديم منتجات عالية الجودة تلبي احتياجات كل عائلة.',
            about_p2: 'نؤمن بأن المنزل هو المكان الأغلى، لذا نحرص على توفير أجهزة تجمع بين التكنولوجيا الحديثة، التصميم الأنيق، والكفاءة العالية في استهلاك الطاقة.',
            about_vision_title: 'رؤيتنا',
            about_vision_text: 'الريادة في سوق الأجهزة الكهرومنزلية بجودة لا تضاهى.',
            about_mission_title: 'رسالتنا',
            about_mission_text: 'توفير أحدث الأجهزة بأسعار تنافسية وخدمة ما بعد البيع.',
            about_values_title: 'قيمنا',
            about_values_text: 'الجودة، الثقة، الابتكار، ورضا العميل فوق كل اعتبار.',
            stat_years: 'سنوات خبرة',
            stat_clients: 'عميل سعيد',
            stat_products: 'منتج متنوع',
            stat_branches: 'فروع في ليبيا',
            stat_brands: 'علامة تجارية',
            brands_tag: 'شركاؤنا',
            brands_title: 'الماركات العالمية',
            brands_subtitle: 'نفخر بتمثيل أفضل الماركات في العالم',
            products_tag: 'تشكيلتنا',
            products_title: 'منتجاتنا',
            products_subtitle: 'أحدث الموديلات من أفضل الماركات العالمية',
            product_new: 'جديد',
            product_fridge: 'ثلاجات',
            product_fridge_desc: 'أحدث التقنيات في التبريد والتجميد بتصاميم عصرية.',
            product_washer: 'غسالات',
            product_washer_desc: 'غسالات أوتوماتيكية بتقنيات التعقيم والتجفيف المتكاملة.',
            product_ac: 'مكيفات',
            product_ac_desc: 'أنظمة تبريد وتدفئة موفرة للطاقة وصديقة للبيئة.',
            product_oven: 'أفران',
            product_oven_desc: 'أفران كهربائية وغاز بتقنيات الطهي الذكية.',
            product_microwave: 'ميكروويف',
            product_microwave_desc: 'أفران ميكروويف متعددة الوظائف لتسخين وطهي سريع.',
            product_vacuum: 'مكانس',
            product_vacuum_desc: 'مكانس كهربائية بتقنيات الشفط القوي والتنظيف العميق.',
            product_inquire: 'استفسر',
            services_tag: 'خدماتنا',
            services_title: 'خدمات ما بعد البيع',
            services_subtitle: 'نحن معك حتى بعد الشراء',
            service_1_title: 'دعم فني على مدار الساعة',
            service_1_desc: 'فريق دعم فني متخصص جاهز للإجابة على استفساراتك 24/7.',
            service_2_title: 'صيانة وتركيب',
            service_2_desc: 'خدمة تركيب وصيانة احترافية لجميع الأجهزة التي نبيعها.',
            service_3_title: 'ضمان طويل الأمد',
            service_3_desc: 'ضمان يصل إلى 5 سنوات على جميع المنتجات.',
            service_4_title: 'خدمات التوصيل',
            service_4_desc: 'خدمة توصيل مجانية لجميع أنحاء ليبيا.',
            why_tag: 'مميزاتنا',
            why_title: 'لماذا تختارنا؟',
            why_subtitle: 'نضع ثقتك في المقام الأول',
            why_quality: 'جودة لا تضاهى',
            why_quality_desc: 'منتجاتنا من أفضل الماركات العالمية بمعايير جودة صارمة.',
            why_trust: 'ثقة العملاء',
            why_trust_desc: 'أكثر من 1500 عميل يثقون بخدماتنا ومنتجاتنا.',
            why_eco: 'موفرة للطاقة',
            why_eco_desc: 'أجهزة عالية الكفاءة تقلل من استهلاك الطاقة.',
            why_support: 'دعم فوري',
            why_support_desc: 'فريق دعم جاهز لخدمتك في أي وقت.',
            testimonials_tag: 'شهادات',
            testimonials_title: 'آراء عملائنا',
            testimonials_subtitle: 'ما يقوله عملاؤنا عن تجربتهم معنا',
            testimonial_1: '"أفضل تجربة شراء أجهزة منزلية في ليبيا. المنتجات أصلية والخدمة ممتازة."',
            testimonial_job_1: 'مدير شركة',
            testimonial_2: '"مكيفات الواحة الجديدة ممتازة وموفرة للطاقة. أنصح بها بشدة."',
            testimonial_job_2: 'ربة منزل',
            testimonial_3: '"خدمة ما بعد البيع ممتازة وفريق العمل محترف. شكراً لكم."',
            testimonial_job_3: 'مهندس معماري',
            testimonial_4: '"أسعار مناسبة وجودة عالية. ثلاجات الواحة من أفضل الأنواع في السوق."',
            testimonial_job_4: 'صاحب مطعم',
            testimonial_5: '"تعامل راقي ومنتجات مضمونة. أنصح الجميع بالتعامل معهم."',
            testimonial_job_5: 'مصممة ديكور',
            gallery_tag: 'معرضنا',
            gallery_title: 'معرض الصور',
            gallery_subtitle: 'لحظات من عملنا ومنتجاتنا',
            faq_tag: 'استفسارات',
            faq_title: 'الأسئلة الشائعة',
            faq_subtitle: 'أجوبة لأكثر الأسئلة التي تهمك',
            faq_1_q: 'ما هي الماركات التي توكّلها الشركة؟',
            faq_1_a: 'نحن الوكيل الحصري لأكثر من 50 ماركة عالمية في مجال الأجهزة الكهرومنزلية، بما في ذلك سامسونج، إل جي، باناسونيك، وغيرها.',
            faq_2_q: 'هل تقدمون خدمة التركيب؟',
            faq_2_a: 'نعم، نوفر خدمة تركيب احترافية لجميع الأجهزة التي نبيعها، مع ضمان جودة التركيب.',
            faq_3_q: 'ما هي مدة الضمان؟',
            faq_3_a: 'نقدم ضمان يصل إلى 5 سنوات على جميع المنتجات، مع خدمة صيانة دورية مجانية.',
            faq_4_q: 'هل تتوفر خدمة التوصيل؟',
            faq_4_a: 'نعم، نقدم خدمة توصيل مجانية لجميع أنحاء ليبيا، مع تغليف آمن للمنتجات.',
            faq_5_q: 'كيف يمكنني التواصل مع فريق الدعم؟',
            faq_5_a: 'يمكنك التواصل معنا عبر الهاتف، البريد الإلكتروني، أو عبر نموذج التواصل في الموقع. نرد على جميع الاستفسارات خلال 24 ساعة.',
            contact_tag: 'تواصل معنا',
            contact_title: 'نحن هنا لخدمتك',
            contact_subtitle: 'تواصل معنا وسنرد عليك في أقرب وقت',
            contact_name: 'الاسم الكامل',
            contact_email: 'البريد الإلكتروني',
            contact_phone: 'رقم الهاتف',
            contact_subject: 'الموضوع',
            contact_message: 'الرسالة',
            contact_send: 'إرسال',
            contact_address_title: 'العنوان',
            contact_address: 'طرابلس، ليبيا',
            contact_phone_title: 'الهاتف',
            contact_email_title: 'البريد الإلكتروني',
            contact_hours_title: 'ساعات العمل',
            contact_hours: 'الأحد - الخميس: 9 صباحاً - 9 مساءً',
            footer_about: 'وكيل حصري لأكبر الماركات العالمية في الأجهزة الكهرومنزلية في ليبيا.',
            footer_quick_links: 'روابط سريعة',
            footer_contact_title: 'معلومات التواصل',
            footer_address: 'طرابلس، ليبيا',
            footer_hours: 'الأحد - الخميس: 9ص - 9م',
            footer_newsletter: 'اشترك في النشرة',
            footer_newsletter_text: 'احصل على أحدث العروض والمنتجات',
            footer_copyright: 'شركة الواحة الجديدة - جميع الحقوق محفوظة'
        },
        en: {
            nav_about: 'About Us',
            nav_brands: 'Brands',
            nav_products: 'Products',
            nav_services: 'Services',
            nav_why: 'Why Us',
            nav_testimonials: 'Testimonials',
            nav_gallery: 'Gallery',
            nav_faq: 'FAQ',
            nav_contact: 'Contact',
            nav_contact_btn: 'Contact Us',
            hero_badge: '🇱🇾 Exclusive Agent in Libya',
            hero_title: 'Best Home Appliances<br />with <span class="gold">Unmatched Quality</span>',
            hero_desc: 'We offer the latest models from top international brands, with quality assurance and after-sales service.',
            hero_btn_products: 'Explore Products',
            hero_btn_contact: 'Contact Us',
            about_tag: 'About Us',
            about_title: 'About Us',
            about_subtitle: 'Al Wahah New Company .. Quality for Your Home',
            about_exp: 'Years of Experience',
            about_heading: 'Your Trusted Partner in Home Appliances',
            about_p1: 'Al Wahah New Company was established in 2008 to be the exclusive agent for the world\'s largest brands in home appliances in Libya. Since then, we are committed to providing high-quality products that meet the needs of every family.',
            about_p2: 'We believe that home is the most precious place, so we strive to provide appliances that combine modern technology, elegant design, and high energy efficiency.',
            about_vision_title: 'Our Vision',
            about_vision_text: 'Leadership in the home appliances market with unparalleled quality.',
            about_mission_title: 'Our Mission',
            about_mission_text: 'To provide the latest appliances at competitive prices with after-sales service.',
            about_values_title: 'Our Values',
            about_values_text: 'Quality, Trust, Innovation, and Customer Satisfaction above all.',
            stat_years: 'Years Experience',
            stat_clients: 'Happy Clients',
            stat_products: 'Diverse Products',
            stat_branches: 'Branches in Libya',
            stat_brands: 'Brands',
            brands_tag: 'Our Partners',
            brands_title: 'Global Brands',
            brands_subtitle: 'We are proud to represent the best brands in the world',
            products_tag: 'Our Collection',
            products_title: 'Our Products',
            products_subtitle: 'Latest models from top international brands',
            product_new: 'New',
            product_fridge: 'Refrigerators',
            product_fridge_desc: 'Latest cooling and freezing technologies with modern designs.',
            product_washer: 'Washing Machines',
            product_washer_desc: 'Automatic washers with sterilization and integrated drying technologies.',
            product_ac: 'Air Conditioners',
            product_ac_desc: 'Energy-efficient heating and cooling systems that are eco-friendly.',
            product_oven: 'Ovens',
            product_oven_desc: 'Electric and gas ovens with smart cooking technologies.',
            product_microwave: 'Microwaves',
            product_microwave_desc: 'Multi-function microwave ovens for quick heating and cooking.',
            product_vacuum: 'Vacuums',
            product_vacuum_desc: 'Electric vacuums with powerful suction and deep cleaning technologies.',
            product_inquire: 'Inquire',
            services_tag: 'Our Services',
            services_title: 'After-Sales Services',
            services_subtitle: 'We are with you even after purchase',
            service_1_title: '24/7 Technical Support',
            service_1_desc: 'A specialized technical support team ready to answer your inquiries 24/7.',
            service_2_title: 'Maintenance & Installation',
            service_2_desc: 'Professional installation and maintenance for all appliances we sell.',
            service_3_title: 'Long-Term Warranty',
            service_3_desc: 'Warranty of up to 5 years on all products.',
            service_4_title: 'Free Delivery',
            service_4_desc: 'Free delivery service to all parts of Libya.',
            why_tag: 'Our Features',
            why_title: 'Why Choose Us?',
            why_subtitle: 'We put your trust first',
            why_quality: 'Unmatched Quality',
            why_quality_desc: 'Our products are from the best global brands with strict quality standards.',
            why_trust: 'Client Trust',
            why_trust_desc: 'More than 1500 clients trust our services and products.',
            why_eco: 'Energy Efficient',
            why_eco_desc: 'High-efficiency appliances that reduce energy consumption.',
            why_support: 'Instant Support',
            why_support_desc: 'A support team ready to serve you at any time.',
            testimonials_tag: 'Testimonials',
            testimonials_title: 'What Our Clients Say',
            testimonials_subtitle: 'What our clients say about their experience with us',
            testimonial_1: '"The best home appliance shopping experience in Libya. Genuine products and excellent service."',
            testimonial_job_1: 'Company Manager',
            testimonial_2: '"Al Wahah air conditioners are excellent and energy-efficient. Highly recommend."',
            testimonial_job_2: 'Homemaker',
            testimonial_3: '"After-sales service is excellent and the team is professional. Thank you."',
            testimonial_job_3: 'Architect',
            testimonial_4: '"Affordable prices and high quality. Al Wahah refrigerators are among the best on the market."',
            testimonial_job_4: 'Restaurant Owner',
            testimonial_5: '"Excellent treatment and guaranteed products. I recommend everyone to deal with them."',
            testimonial_job_5: 'Interior Designer',
            gallery_tag: 'Our Gallery',
            gallery_title: 'Photo Gallery',
            gallery_subtitle: 'Moments from our work and products',
            faq_tag: 'FAQs',
            faq_title: 'Frequently Asked Questions',
            faq_subtitle: 'Answers to the most common questions',
            faq_1_q: 'What brands does the company represent?',
            faq_1_a: 'We are the exclusive agent for more than 50 global brands in home appliances, including Samsung, LG, Panasonic, and others.',
            faq_2_q: 'Do you offer installation services?',
            faq_2_a: 'Yes, we provide professional installation services for all appliances we sell, with installation quality guarantee.',
            faq_3_q: 'What is the warranty period?',
            faq_3_a: 'We offer a warranty of up to 5 years on all products, with free regular maintenance service.',
            faq_4_q: 'Is delivery service available?',
            faq_4_a: 'Yes, we offer free delivery service to all parts of Libya, with safe packaging for products.',
            faq_5_q: 'How can I contact the support team?',
            faq_5_a: 'You can contact us via phone, email, or through the contact form on the website. We respond to all inquiries within 24 hours.',
            contact_tag: 'Contact Us',
            contact_title: 'We Are Here to Serve You',
            contact_subtitle: 'Contact us and we will get back to you as soon as possible',
            contact_name: 'Full Name',
            contact_email: 'Email Address',
            contact_phone: 'Phone Number',
            contact_subject: 'Subject',
            contact_message: 'Message',
            contact_send: 'Send',
            contact_address_title: 'Address',
            contact_address: 'Tripoli, Libya',
            contact_phone_title: 'Phone',
            contact_email_title: 'Email',
            contact_hours_title: 'Working Hours',
            contact_hours: 'Sun - Thu: 9 AM - 9 PM',
            footer_about: 'Exclusive agent for the world\'s largest brands in home appliances in Libya.',
            footer_quick_links: 'Quick Links',
            footer_contact_title: 'Contact Info',
            footer_address: 'Tripoli, Libya',
            footer_hours: 'Sun - Thu: 9AM - 9PM',
            footer_newsletter: 'Subscribe to Newsletter',
            footer_newsletter_text: 'Get the latest offers and products',
            footer_copyright: 'Al Wahah New Company - All Rights Reserved'
        }
    };

    if (langToggle && langLabel) {
        langToggle.addEventListener('click', () => {
            if (currentLang === 'ar') {
                currentLang = 'en';
                html.lang = 'en';
                html.dir = 'ltr';
                langLabel.textContent = 'AR';
            } else {
                currentLang = 'ar';
                html.lang = 'ar';
                html.dir = 'rtl';
                langLabel.textContent = 'EN';
            }
            applyTranslations(currentLang);
        });

        function applyTranslations(lang) {
            const t = translations[lang];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (t[key] !== undefined) {
                    if (key === 'hero_title') {
                        el.innerHTML = t[key];
                    } else {
                        el.textContent = t[key];
                    }
                }
            });
        }
        applyTranslations('ar');
    }

    // ============================================================
    // 8. CONTACT FORM
    // ============================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(currentLang === 'ar' ? 'تم استلام رسالتك! سنتواصل معك قريباً.' : 'Your message has been received! We will contact you soon.');
            contactForm.reset();
        });
    }

    // ============================================================
    // 9. HERO IMAGE FADE
    // ============================================================
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) {
        heroImg.style.opacity = '0';
        heroImg.style.transition = 'opacity 1.2s ease';
        setTimeout(() => { heroImg.style.opacity = '1'; }, 400);
    }

});