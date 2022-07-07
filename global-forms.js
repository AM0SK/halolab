
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
            console.log('lotties initialised');
            $('[data-lottie^=lottie-form]').each(function(index, el) {
                let attr = $(this).attr('data-lottie');
                animations[index].name = attr;
                lottie.stop(attr);
                console.log(animations[index].name);
            });
        })
        .catch((error) => {
            console.error(error)
        })
})

// After submit
function isSpForm() {
    if ($('form[class^=sp-]').length) {
        const spForm = $('form[class^=sp-]'),
            spInputs = $(spForm).find('input'),
            spButton = $(spForm).find('button');

        $('.w-input[name=email]').on('keyup', function() {
            $(spInputs[0]).val($(this).val());
        });
        $('form[id^=wf-form-]').submit(function(e) {
            let formSubmitted = $(e.target),
                lottieAttr = $(formSubmitted).find('[data-lottie]').attr('data-lottie'),
                isActive = $(formSubmitted).find('[data-form-submitted=active]').attr('data-form-submitted');
            $(formSubmitted).find('input:not(:submit)').val('');


            if (typeof isActive !== 'undefined' && isActive !== false) {
                $(formSubmitted).find('[data-form-submitted=active]').addClass('active');
            }

            $(formSubmitted).find('[data-form-submitted=hide]').fadeTo(300, 0);
            lottie.play(lottieAttr);
            setTimeout(() => {
                if (typeof isActive !== 'undefined' && isActive !== false) {
                    $(formSubmitted).find('[data-form-submitted=active]').removeClass('active');
                }
                $(formSubmitted).find('[data-form-submitted=hide]').fadeTo(300, 1)
                lottie.stop(lottieAttr)
            }, 3000);

            $(spButton).click();
            return false
        });
    } else { setTimeout(isSpForm, 2000) }
}
isSpForm();
