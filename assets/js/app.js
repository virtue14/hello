/** app.js
 *
 * Entry for bundling by webpack.
 */

/* global hljs, T */

/** @see https://alpinejs.dev */
import Alpine from 'alpinejs'

/** @see https://alpinejs.dev/plugins/intersect */
import intersect from '@alpinejs/intersect'

Alpine.plugin(intersect)

/** @see https://alpinejs.dev/plugins/collapse */
import collapse from '@alpinejs/collapse'

Alpine.plugin(collapse)

window.Alpine = Alpine

// highlight.js 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (typeof hljs !== 'undefined') {
        // 모든 코드 블록에 Google-style header 추가
        document.querySelectorAll('pre code').forEach((codeBlock) => {
            const pre = codeBlock.parentElement
            if (pre && !pre.parentElement.classList.contains('code-block-wrapper')) {
                // Trim code content
                const originalCode = (codeBlock.textContent || '').trim()
                codeBlock.textContent = originalCode

                // 언어 감지
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

                // Wrapper & Header 생성
                const wrapper = document.createElement('div')
                wrapper.className = 'code-block-wrapper'

                const header = document.createElement('div')
                header.className = 'code-header'

                // 언어 표시
                const langLabel = document.createElement('span')
                langLabel.className = 'code-language'
                langLabel.textContent = language.toUpperCase()
                header.appendChild(langLabel)

                // Copy Button
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

                // Pre element 이동
                pre.parentNode.insertBefore(wrapper, pre)
                wrapper.appendChild(pre)

                // hljs 하이라이팅
                if (!codeBlock.dataset.highlighted) {
                    hljs.highlightElement(codeBlock)
                    codeBlock.dataset.highlighted = 'yes'
                }
            }
        })
    }
})

// Alpine.start()는 app.pug에서 DOMContentLoaded 후에 호출됩니다
// 이렇게 하면 모든 Store와 Component 정의가 먼저 등록됩니다

// Admin Button Initialization
function initAdminButton() {
    const btn = document.getElementById('admin-edit-fallback');
    // 버튼이 없으면(권한 없음 등) 종료
    if (!btn) return;

    const nativeBtn = document.querySelector('.wrap_btn_etc');

    // 1. entryId 감지 (T.config 또는 URL)
    let entryId = null;
    if (typeof T !== 'undefined' && T.config && T.config.entryId) {
        entryId = T.config.entryId;
    } else {
        // URL에서 글 ID 추출 (예: /123, /entry/123)
        const match = window.location.pathname.match(/^\/(?:entry\/)?(\d+)$/);
        if (match) {
            entryId = match[1];
        }
    }

    // 2. 상세 페이지 로직 (네이티브 버튼 활용 우선)
    if (nativeBtn) {
        // 네이티브 버튼 숨기기
        nativeBtn.style.cssText = 'display: none !important;';

        // 수정 링크 찾기
        const editLink = nativeBtn.querySelector('a[href*="/newpost/"]');
        if (editLink) {
            // 수정 링크가 있으면 우리 버튼에 적용
            btn.href = editLink.href;
            btn.title = '수정';
            btn.style.display = 'flex'; // 강제 표시

            const txtSpan = btn.querySelector('.txt');
            const icoSpan = btn.querySelector('.ico');
            if (txtSpan) txtSpan.textContent = '수정';
            if (icoSpan) {
                icoSpan.classList.remove('fa-pen');
                icoSpan.classList.add('fa-edit');
            }
        }
    }
    // 3. 네이티브 버튼 못 찾았지만 entryId가 있는 경우 (비상용)
    else if (entryId) {
        btn.href = '/manage/newpost/?id=' + entryId + '&type=post';
        btn.title = '수정';
        btn.style.display = 'flex'; // 강제 표시

        const txtSpan = btn.querySelector('.txt');
        if (txtSpan) txtSpan.textContent = '수정';
        const icoSpan = btn.querySelector('.ico');
        if (icoSpan) {
            icoSpan.classList.remove('fa-pen');
            icoSpan.classList.add('fa-edit');
        }
    }

    // 4. Tistory 네이티브 버튼이 나중에 로드될 경우를 대비한 Observer
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function (mutations, obs) {
            const lateNativeBtn = document.querySelector('.wrap_btn_etc');
            if (lateNativeBtn) {
                lateNativeBtn.style.cssText = 'display: none !important;'; // 네이티브 숨김

                const editLink = lateNativeBtn.querySelector('a[href*="/newpost/"]');
                if (editLink) {
                    btn.href = editLink.href;
                    btn.title = '수정';
                    btn.style.display = 'flex';

                    const txtSpan = btn.querySelector('.txt');
                    const icoSpan = btn.querySelector('.ico');
                    if (txtSpan) txtSpan.textContent = '수정';
                    if (icoSpan) {
                        icoSpan.classList.remove('fa-pen');
                        icoSpan.classList.add('fa-edit');
                    }
                }
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

document.addEventListener('DOMContentLoaded', initAdminButton);
