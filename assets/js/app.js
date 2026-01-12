/** app.js
 *
 * Entry for bundling by webpack.
 */

/* global hljs, T, darkMode */

/** @see https://alpinejs.dev */
import Alpine from 'alpinejs'

/** @see https://alpinejs.dev/plugins/intersect */
import intersect from '@alpinejs/intersect'

Alpine.plugin(intersect)

/** @see https://alpinejs.dev/plugins/collapse */
import collapse from '@alpinejs/collapse'

Alpine.plugin(collapse)

window.Alpine = Alpine

// Tag Dictionary for formatting
import { tagDictionary } from './utils/tagDictionary';

// ============================================
// CRITICAL: Register ALL Alpine components and stores DIRECTLY
// (NOT inside 'alpine:init' event listener - that doesn't work with Webpack bundling)
// ============================================

// 1. App Store (전역 상태)
Alpine.store('app', {
    dark: typeof darkMode !== 'undefined' ? darkMode.on : false,
    loading: true
});

// 2. Header Store (Pug의 Header.pug에서 사용)
Alpine.store('header', {
    title: '',
    show: true
});

// 3. Indicator Store (Pug의 Indicator.pug에서 사용)
Alpine.store('indicator', {
    scrolled: 0,
    indicate() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        Alpine.store('indicator').scrolled = (winScroll / height) * 100;
    }
});

// 4. Tag Component
Alpine.data('tag', () => ({
    search: '',
    count: 0,
    total: 0,
    init() {
        this.removeAllCommas()
        this.mapTags()
        this.$nextTick(() => {
            const items = this.$root.querySelectorAll('.tag');
            this.total = items.length;
            this.count = items.length;
        })
    },

    removeAllCommas() {
        for (const node of this.$el.childNodes) {
            if (node.nodeType === 3) {
                node.remove()
            }
        }
    },
    mapTags() {
        const links = this.$el.querySelectorAll('a');
        links.forEach(link => {
            let targetNode = link;
            const spanLink = link.querySelector('span.link');
            if (spanLink) {
                targetNode = spanLink;
            }

            const text = targetNode.textContent.trim();
            const lower = text.toLowerCase();
            let newText = text;

            if (tagDictionary[lower]) {
                newText = tagDictionary[lower];
            } else if (text.includes(' ')) {
                const words = text.split(' ');
                const mappedWords = words.map(word => {
                    const wLower = word.toLowerCase();
                    if (tagDictionary[wLower]) return tagDictionary[wLower];
                    return word.charAt(0).toUpperCase() + word.slice(1);
                });
                newText = mappedWords.join(' ');
            } else if (/^[a-z]/.test(text)) {
                newText = text.charAt(0).toUpperCase() + text.slice(1);
            }

            if (targetNode !== link) {
                targetNode.textContent = newText;
            } else {
                link.textContent = newText;
            }

            link.closest('.tag')?.setAttribute('data-tag-name', newText.toLowerCase());
        });
    },
    filterTags() {
        const query = this.search.toLowerCase();
        // Use $root instead of $el because $el in event handlers points to the triggering element (input)
        const root = this.$root;
        const items = root.querySelectorAll('.tag');

        let visibleCount = 0;
        items.forEach(item => {
            const name = item.dataset.tagName || item.textContent.toLowerCase();
            if (name.includes(query)) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        this.count = visibleCount;
    }


}));

// 5. Bottom Component (다크모드 토글)
Alpine.data('bottom', () => ({
    toggleTheme() {
        if (typeof darkMode !== 'undefined') {
            darkMode.toggle()
            Alpine.store('app').dark = !Alpine.store('app').dark
        }
    }
}));

// 6. Social Links Parsing Component
Alpine.data('parseSocialLinks', (description = '') => ({
    description,
    socialLinks: [],

    init() {
        const desc = this.description || '';
        const links = [];

        const github = desc.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
        if (github) links.push({ url: `https://github.com/${github[1]}`, icon: 'fa-brands fa-github' });

        const linkedin = desc.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
        if (linkedin) links.push({ url: `https://linkedin.com/in/${linkedin[1]}`, icon: 'fa-brands fa-linkedin' });

        const instagram = desc.match(/instagram\.com\/([a-zA-Z0-9_.]+)/i);
        if (instagram) links.push({ url: `https://instagram.com/${instagram[1]}`, icon: 'fa-brands fa-instagram' });

        const twitter = desc.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i);
        if (twitter) links.push({ url: `https://x.com/${twitter[1]}`, icon: 'fa-brands fa-x-twitter' });

        const email = desc.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (email) links.push({ url: `mailto:${email[1]}`, icon: 'fa-solid fa-envelope' });

        this.socialLinks = links;
    }
}));

// 7. Link Icon Router
Alpine.data('linkIconRouter', () => ({
    iconClass: 'fa-solid fa-link',
    iconStyle: '',

    init() {
        const name = this.$el.closest('a').getAttribute('title') || '';
        const result = this.getIcon(name);
        this.iconClass = result.className;
        this.iconStyle = result.style || '';
    },

    getIcon(name) {
        const n = name.toLowerCase();

        if (n.includes('밀로(millo)') || n.includes('밀로')) {
            return { className: 'fa-solid fa-lightbulb' };
        }
        if (n.includes('project') || n.includes('프로젝트')) {
            return { className: 'fa-solid fa-code-branch' };
        }

        if (n.includes('github')) return { className: 'fa-brands fa-github' };
        if (n.includes('gitlab')) return { className: 'fa-brands fa-gitlab' };
        if (n.includes('linkedin')) return { className: 'fa-brands fa-linkedin' };
        if (n.includes('instagram')) return { className: 'fa-brands fa-instagram' };
        if (n.includes('twitter') || n === 'x') return { className: 'fa-brands fa-x-twitter' };
        if (n.includes('facebook')) return { className: 'fa-brands fa-facebook' };
        if (n.includes('youtube')) return { className: 'fa-brands fa-youtube' };
        if (n.includes('twitch')) return { className: 'fa-brands fa-twitch' };
        if (n.includes('tiktok')) return { className: 'fa-brands fa-tiktok' };
        if (n.includes('discord')) return { className: 'fa-brands fa-discord' };
        if (n.includes('email') || n.includes('mail') || n.includes('메일')) return { className: 'fa-solid fa-envelope' };
        if (n.includes('velog')) return { className: 'fa-brands fa-vimeo-v' };
        if (n.includes('notion')) return { className: 'fa-solid fa-n' };

        return { className: 'fa-solid fa-link' };
    }
}));

// 8. App Component (App Logic)
Alpine.data('app', () => ({
    get dark() {
        return Alpine.store('app').dark;
    },
    get loading() {
        return Alpine.store('app').loading;
    },
    init() {
        this.loaded()
    },
    loaded() {
        setTimeout(() => Alpine.store('app').loading = false, 100)
    }
}));

// ============================================
// highlight.js 초기화 (DOMContentLoaded 이후)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((codeBlock) => {
            const pre = codeBlock.parentElement
            if (pre && !pre.parentElement.classList.contains('code-block-wrapper')) {
                const originalCode = (codeBlock.textContent || '').trim()
                codeBlock.textContent = originalCode

                let language = 'text'
                const langClass = Array.from(codeBlock.classList).find(c => c.startsWith('language-'))
                if (langClass) {
                    language = langClass.replace('language-', '')
                } else {
                    const dataLang = pre.dataset.keLanguage || codeBlock.dataset.keLanguage
                    if (dataLang) {
                        language = dataLang
                    } else {
                        const validClasses = Array.from(codeBlock.classList).filter(c => c !== 'hljs')
                        if (validClasses.length > 0) language = validClasses[0]
                    }
                }

                const wrapper = document.createElement('div')
                wrapper.className = 'code-block-wrapper'

                const header = document.createElement('div')
                header.className = 'code-header'

                const langLabel = document.createElement('span')
                langLabel.className = 'code-language'
                langLabel.textContent = language.toUpperCase()
                header.appendChild(langLabel)

                const copyBtn = document.createElement('button')
                copyBtn.className = 'code-copy-button'
                copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
                copyBtn.setAttribute('aria-label', '코드 복사')
                copyBtn.onclick = async () => {
                    await navigator.clipboard.writeText(originalCode)
                    copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                    setTimeout(() => {
                        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
                    }, 2000)
                }

                header.appendChild(copyBtn)
                wrapper.appendChild(header)

                pre.parentNode.insertBefore(wrapper, pre)
                wrapper.appendChild(pre)

                if (!codeBlock.dataset.highlighted) {
                    hljs.highlightElement(codeBlock)
                    codeBlock.dataset.highlighted = 'yes'
                }
            }
        })
    }

    // Admin Button Initialization
    initAdminButton();
});

// Admin Button Initialization
function initAdminButton() {
    const btn = document.getElementById('admin-edit-fallback');

    let entryId = null;
    if (typeof T !== 'undefined' && T.config && T.config.entryId) {
        entryId = T.config.entryId;
    } else {
        const match = window.location.pathname.match(/^\/(?:entry\/)?(\d+)$/);
        if (match) {
            entryId = match[1];
        }
    }

    const nativeBtn = document.querySelector('.wrap_btn_etc');

    if (entryId) {
        if (!btn) return;

        let editHref = null;

        if (nativeBtn) {
            nativeBtn.style.cssText = 'display: none !important;';
            const link = nativeBtn.querySelector('a[href*="/newpost/"]');
            if (link) editHref = link.href;
        }

        if (editHref) {
            btn.href = editHref;
        } else {
            btn.href = '/manage/newpost/' + entryId + '?type=post&returnURL=ENTRY';
        }

        btn.title = '수정';
        btn.style.display = 'flex';

        const txtSpan = btn.querySelector('.txt');
        if (txtSpan) txtSpan.textContent = '수정';

        const icoSpan = btn.querySelector('.ico');
        if (icoSpan) {
            icoSpan.classList.remove('fa-pen');
            icoSpan.classList.add('fa-edit');
        }

        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(function (mutations, obs) {
                const lateNative = document.querySelector('.wrap_btn_etc');
                if (lateNative) {
                    lateNative.style.cssText = 'display: none !important;';
                    const link = lateNative.querySelector('a[href*="/newpost/"]');
                    if (link) btn.href = link.href;
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    } else {
        if (btn) {
            btn.style.display = 'flex';
        }
    }
}

// ============================================
// Alpine.start() 는 app.pug에서 DOMContentLoaded 후에 호출됨
// 모든 Stores와 Components가 위에서 직접 등록되어 있으므로
// Alpine.start()가 호출될 때 모두 사용 가능
// ============================================
