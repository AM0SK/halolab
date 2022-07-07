// Animate lottie after submit
let lottie, animations;
// Return a promise that resolves to true once animation is loaded
async function animationLoaded(animation) {
    if (animation.isLoaded) {
        return true
    }
    return new Promise((resolve, reject) => {
        animation.addEventListener('DOMLoaded', () => {
            resolve(true)
        })
    })
}
// Return a promise that resolves to true once all animations are loaded
async function waitForAnimationsLoaded(animations) {
    await Promise.all(animations.map(animationLoaded))
}
async function initAnimations() {
    lottie = Webflow.require('lottie').lottie
    animations = lottie.getRegisteredAnimations()
    await waitForAnimationsLoaded(animations)
}
var Webflow = Webflow || []
Webflow.push(() => {
    initAnimations()
        .then(() => {
            $('.lottie-check').each(function(index, el) {
                let attr = $(this).attr('data-lottie');
                animations[index].name = attr;
                lottie.stop(attr);
            });
        })
        .catch((error) => {
            console.error(error)
        })
})

// After submit
function isSpForm() {
    if ($('form[class^=sp-]').length) {
        const spForm = $('form[class^=sp-]');
        const spInputs = $(spForm).find('input');
        const spButton = $(spForm).find('button');

        $('.w-input[name=email]').on('keyup', function() {
            $(spInputs[0]).val($(this).val());
        });
        $('form[id^=wf-form-]').submit(function(e) {
            let lottieAttr = $(e.target).find('[data-lottie]').attr('data-lottie');
            let textAnim = $(e.target).find(':submit').siblings('.overflow-hidden');
            $(e.target).find('input:not(:submit)').val('');
            $(textAnim).fadeTo(300, 0)
            lottie.play(lottieAttr);
            setTimeout(() => {
                $(textAnim).fadeTo(300, 1)
                lottie.stop(lottieAttr)
            }, 3000);

            $(spButton).click();
            return false
        });
    } else { setTimeout(isSpForm, 2000) }
}
isSpForm();
