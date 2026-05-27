/**
 * Report Page - Tab Navigation & Interactions
 * Han-Maek Family Management Information System
 */
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Update buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${targetTab}`) {
                    panel.classList.add('active');
                }
            });

            // Scroll to top of content
            document.querySelector('.main-content').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animatable elements
    const animatables = document.querySelectorAll(
        '.info-card, .scope-item, .benchmark-card, .goal-card, .effect-item, .gallery-item'
    );
    animatables.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
        observer.observe(el);
    });

    // Preview Slider Logic (A/B 필터 제거 — 11장 단일 슬라이더)
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicator = document.getElementById('sliderIndicator');

    let currentIndex = 0;

    const updateSlider = () => {
        const slides = document.querySelectorAll('#previewSlider .slide');
        const total = slides.length;

        // Hide ALL slides first
        slides.forEach(s => {
            s.style.display = 'none';
            s.classList.remove('active');
        });

        // Show ONLY the current slide
        if (slides[currentIndex]) {
            slides[currentIndex].style.display = 'flex';
            slides[currentIndex].classList.add('active');
        }

        // Update indicator
        if (indicator) {
            indicator.textContent = `${currentIndex + 1} / ${total}`;
        }
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const total = document.querySelectorAll('#previewSlider .slide').length;
            currentIndex = (currentIndex - 1 + total) % total;
            updateSlider();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const total = document.querySelectorAll('#previewSlider .slide').length;
            currentIndex = (currentIndex + 1) % total;
            updateSlider();
        });
    }

    // Dynamic slide loader — tries .png then .PNG; stops when both fail
    // Adding new images (e.g. "10-14. 전체-14.png") to assets/img/ is all that's needed
    (function loadSlides() {
        const wrapper = document.getElementById('previewSlider');
        if (!wrapper) { updateSlider(); return; }

        wrapper.innerHTML = '';
        let n = 1;

        function tryLoad(exts) {
            if (!exts.length) {
                // Both extensions failed → no more images
                currentIndex = 0;
                updateSlider();
                return;
            }
            const src = `assets/img/10-${n}. 전체-${n}.${exts[0]}`;
            const probe = new Image();
            probe.onload = function () {
                const div = document.createElement('div');
                div.className = 'slide';
                div.dataset.index = String(n - 1);
                const img = document.createElement('img');
                img.src = src;
                img.alt = `예시 화면 ${n}`;
                img.style.cursor = 'zoom-in';
                img.title = '클릭하면 크게 볼 수 있습니다';
                img.addEventListener('click', () => {
                    const lbOverlay = document.getElementById('lightboxOverlay');
                    const lbImg = document.getElementById('lightboxImg');
                    if (lbOverlay && lbImg) {
                        lbImg.src = src;
                        lbOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
                div.appendChild(img);
                wrapper.appendChild(div);
                n++;
                tryLoad(['png', 'PNG']);   // reset extension list for next number
            };
            probe.onerror = function () {
                tryLoad(exts.slice(1));   // try next extension
            };
            probe.src = src;
        }

        tryLoad(['png', 'PNG']);
    })();

    // Benchmark Slide-in Logic
    const benchmarkCards = document.querySelectorAll('.benchmark-card');
    const slidePanel = document.getElementById('slidePanel');
    const slideOverlay = document.getElementById('slidePanelOverlay');
    const spClose = document.getElementById('spClose');
    
    const spCategory = document.getElementById('spCategory');
    const spTitle = document.getElementById('spTitle');
    const spTool = document.getElementById('spTool');
    const spDesc = document.getElementById('spDesc');
    const spPoints = document.getElementById('spPoints');
    const spInsight = document.getElementById('spInsight');
    const spImageContainer = document.getElementById('spImageContainer');
    const spPlaceholder = document.getElementById('spImagePlaceholder');

    // Additional mock details and images for the slide-in panel
    const benchmarkData = {
        'amore': {
            img: ['assets/img/1-1. 아모레퍼시픽.png', 'assets/img/1-2. 아모레퍼시픽.png'],
            desc: '아모레퍼시픽은 태블로(Tableau)를 통해 방대한 데이터를 쉽게 활용하여 정보를 분석하고, 인사이트를 도출해 비즈니스를 발전시켜왔습니다. 현업의 직원들은 이제 필요한 정보를 별도의 데이터 추출 과정 없이 직관적으로 확인하며, 경영진 또한 더 나은 의사 결정을 위해 데이터 활용을 전사적으로 고도화해 나가고 있습니다.'
        },
        'kb': {
            img: [],
            desc: 'KB국민은행은 데이터 중심 경영 문화를 위해 태블로를 전사적으로 활용하여 임직원들에게 데이터 기반 인사이트를 제공하고 있습니다. 본점부터 지점까지 일관된 데이터 혁신을 통해 보고서 작성에 소요되는 막대한 시간을 절감하고, 신속하고 정확한 의사결정 체계를 구축하며 금융권 데이터 문화를 선도합니다.'
        },
        'atwom': {
            img: ['assets/img/3-1. 에이투엠.PNG', 'assets/img/3-2. 에이투엠.PNG'],
            desc: '에이투엠(AtwoM)의 경영자정보시스템(EIS)은 한국화학연구원, 한국천문연구원 등에 성공적으로 구축된 솔루션 사례입니다. 경영지원에 필요한 경영기획현황, 연구, 성과데이터 등을 통합 연계하여 실시간 모니터링을 제공합니다. 경영자 관점에서 기관의 성과 지표와 목표 달성 과정을 체계적으로 평가하고, 데이터 기반의 신속하고 정확한 의사결정을 강력히 지원합니다.'
        },
        'microsoft': {
            img: ['assets/img/4-1. Microsoft Executive Dashboard.PNG', 'assets/img/4-2. Microsoft Executive Dashboard.PNG'],
            desc: 'Microsoft의 Power BI 환경에서 제공되는 표준 임원용 대시보드 템플릿 사례입니다. YoY(전년 대비) 변화율을 직관적으로 보여주며, 조직 내의 문제 발생(Incidents/Problems/Requests) 영역을 빠르게 인지할 수 있는 핵심 지표 중심의 레이아웃 구성이 특징입니다.'
        },
        'tableau': {
            img: ['assets/img/tableau_dashboard.png'],
            desc: 'Tableau Public에 공개된 Executive Summary 템플릿으로, 4대 핵심 KPI(매출, 이익, 주문량, 수량)를 최상단에 배치하고, 지도와 게이지 차트를 활용하여 지역/세그먼트별 실적을 한눈에 파악할 수 있도록 구성되었습니다.'
        },
        'foreign': {
            img: ['assets/img/foreign_dashboard.png'],
            desc: '최신 글로벌 BI 트렌드를 반영한 대시보드로, 실시간 데이터 연동은 물론 모바일 환경에 최적화된 반응형 UI, 그리고 요약에서 상세로 파고드는 드릴다운(Drill-down) 분석 기능을 갖추고 있습니다.'
        }
    };

    const openSlidePanel = (card) => {
        const id = card.dataset.id;
        const data = benchmarkData[id] || {};
        
        // Extract data from the clicked card
        const tag = card.querySelector('.benchmark-tag').textContent;
        const name = card.querySelector('.benchmark-name').textContent;
        const tool = card.querySelector('.benchmark-tool').textContent;
        const points = card.querySelector('.benchmark-points').innerHTML;
        const insight = card.querySelector('.benchmark-insight').innerHTML;

        // Populate Panel
        spCategory.textContent = tag;
        spTitle.textContent = name;
        spTool.textContent = tool;
        spDesc.textContent = data.desc || '';
        spPoints.innerHTML = points;
        spInsight.innerHTML = insight;

        // Clear existing dynamically generated images
        const existingImgs = spImageContainer.querySelectorAll('img');
        existingImgs.forEach(img => img.remove());

        // Handle Image Array
        const images = data.img || [];
        if (images.length > 0) {
            spImageContainer.style.display = 'flex';
            spPlaceholder.style.display = 'none';
            images.forEach(src => {
                const imgEl = document.createElement('img');
                imgEl.src = src;
                imgEl.alt = '미리보기 화면';
                imgEl.style.cursor = 'zoom-in';
                imgEl.addEventListener('click', () => {
                    const lbOverlay = document.getElementById('lightboxOverlay');
                    const lbImg = document.getElementById('lightboxImg');
                    if (lbOverlay && lbImg) {
                        lbImg.src = src;
                        lbOverlay.classList.add('active');
                    }
                });
                spImageContainer.appendChild(imgEl);
            });
        } else {
            spImageContainer.style.display = 'none';
        }

        // Show Panel
        slideOverlay.classList.add('active');
        slidePanel.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeSlidePanel = () => {
        slideOverlay.classList.remove('active');
        slidePanel.classList.remove('active');
        document.body.style.overflow = '';
    };

    benchmarkCards.forEach(card => {
        card.addEventListener('click', () => openSlidePanel(card));
    });

    spClose.addEventListener('click', closeSlidePanel);
    slideOverlay.addEventListener('click', closeSlidePanel);

    // Lightbox Close Logic
    const lbOverlay = document.getElementById('lightboxOverlay');
    const lbClose = document.getElementById('lightboxClose');
    if (lbOverlay && lbClose) {
        const closeLb = () => {
            lbOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // small delay to let transition finish before clearing src
            setTimeout(() => {
                document.getElementById('lightboxImg').src = '';
            }, 300);
        };
        lbClose.addEventListener('click', closeLb);
        lbOverlay.addEventListener('click', (e) => {
            if (e.target === lbOverlay) closeLb();
        });
    }

    // ===== Keyboard Arrow Navigation for Preview Slider & Lightbox =====
    document.addEventListener('keydown', (e) => {
        // 활성 탭이 예시 화면 탭인지 확인
        const activeTab = document.querySelector('.tab-btn.active');
        const isDashboardPreviewTab = activeTab && activeTab.dataset.tab === 'dashboard-preview';

        const isLightboxOpen = lbOverlay && lbOverlay.classList.contains('active');

        // 라이트박스가 열려 있을 때 — 슬라이드 이동 + 라이트박스 이미지 동기화
        if (isLightboxOpen && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            e.preventDefault();
            const slides = document.querySelectorAll('#previewSlider .slide');
            const total = slides.length;
            if (total === 0) return;

            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % total;
            } else {
                currentIndex = (currentIndex - 1 + total) % total;
            }

            // 슬라이더도 함께 이동
            updateSlider();

            // 라이트박스 이미지 업데이트
            const lbImg = document.getElementById('lightboxImg');
            const currentSlideImg = slides[currentIndex] && slides[currentIndex].querySelector('img');
            if (lbImg && currentSlideImg) {
                lbImg.src = currentSlideImg.src;
            }
            return;
        }

        // 라이트박스가 닫혀 있을 때 — 예시 화면 탭의 슬라이더만 이동
        if (isDashboardPreviewTab && !isLightboxOpen) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const total = document.querySelectorAll('#previewSlider .slide').length;
                if (total > 0) {
                    currentIndex = (currentIndex + 1) % total;
                    updateSlider();
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const total = document.querySelectorAll('#previewSlider .slide').length;
                if (total > 0) {
                    currentIndex = (currentIndex - 1 + total) % total;
                    updateSlider();
                }
            }
        }
    });

    // ===== Concept Toggle Logic =====
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const conceptContents = document.querySelectorAll('.concept-content');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;

            // Update buttons
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update contents
            conceptContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `concept-${target}`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ===== Benchmark Panel Logic =====
    const openBenchmarkBtns = document.querySelectorAll('.open-benchmark-btn');
    const closeBenchmarkBtn = document.getElementById('close-benchmark-btn');
    const benchmarkPanel = document.getElementById('benchmark-panel');

    if (openBenchmarkBtns.length > 0 && benchmarkPanel) {
        openBenchmarkBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                benchmarkPanel.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });
    }

    if (closeBenchmarkBtn && benchmarkPanel) {
        closeBenchmarkBtn.addEventListener('click', () => {
            benchmarkPanel.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ===== Sitemap Button Logic =====
    const openSitemapBtn = document.getElementById('openSitemapBtn');
    if (openSitemapBtn) {
        openSitemapBtn.addEventListener('click', () => {
            const lbOverlay = document.getElementById('lightboxOverlay');
            const lbImg = document.getElementById('lightboxImg');
            if (lbOverlay && lbImg) {
                lbImg.src = 'assets/img/사이트맵.png';
                lbOverlay.classList.add('active');
            }
        });
    }

    // ===== Concept Example Button Logic =====
    const openConceptExampleBtn = document.getElementById('openConceptExampleBtn');
    if (openConceptExampleBtn) {
        openConceptExampleBtn.addEventListener('click', () => {
            const lbOverlay = document.getElementById('lightboxOverlay');
            const lbImg = document.getElementById('lightboxImg');
            if (lbOverlay && lbImg) {
                lbImg.src = 'assets/img/concept_layout.png';
                lbOverlay.classList.add('active');
            }
        });
    }
});
