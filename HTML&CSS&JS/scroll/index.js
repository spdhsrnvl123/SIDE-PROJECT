(() => {
    let currentScene = 0;
    let prevScrollHeight = 0;
    let yOffset = 0;
    let error_protect = false;

    const scene = [
        { //section-0
            type: "normal",
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-0"),
            }
        },
        { //section-1
            type: "scrollEvent",
            height_add: 3,
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-1"),
                message_A: document.querySelector("#scroll-section-1 .message_A"),
                message_B: document.querySelector("#scroll-section-1 .message_B"),
                message_C: document.querySelector("#scroll-section-1 .message_C")
            },
            value: {
                messageA_opacity_in: [0, 1, { start: 0, end: 0.16 }],
                messageA_opacity_out: [1, 0, { start: 0.19, end: 0.26 }],
                messageA_translateY_in: [30, 0, { start: 0, end: 0.15 }],
                messageA_translateY_out: [0, -40, { start: 0.19, end: 0.26 }],
                
                messageB_opacity_in: [0, 1, { start: 0.26, end: 0.42 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.52 }],
                messageB_translateY_in: [30, 0, { start: 0.26, end: 0.41 }],
                messageB_translateY_out: [0, -40, { start: 0.45, end: 0.52 }],
                
                messageC_opacity_in: [0, 1, { start: 0.52, end: 0.68 }],
                messageC_opacity_out: [1, 0, { start: 0.71, end: 0.78 }],
                messageC_translateY_in: [30, 0, { start: 0.52, end: 0.67 }],
                messageC_translateY_out: [0, -450, { start: 0.71, end: 0.78 }],

            }
        },
        {
            //section-2
            type: "normal",
            scrollHeight: 0,
            objs: {
                container:document.querySelector("#scroll-section-2")
            }
        }
    ]

    const set_Height = () => {
        for (let i = 0; i < scene.length; i++){
            if (scene[i].type === "scrollEvent") {
                scene[i].scrollHeight = scene[i].height_add * window.innerHeight
            } else if (scene[i].type === "normal") {
                scene[i].scrollHeight = scene[i].objs.container.offsetHeight;
            }
            // console.log(scene[i].scrollHeight);
            scene[i].objs.container.style.height = `${scene[i].scrollHeight}px`
        }

        totalHeight = 0;
        for (let i = 0; i < scene.length; i++){
            totalHeight += scene[i].scrollHeight;
            if (totalHeight >= pageYOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    // set_Height();

    const calculate = (value,currentYOffset) => {
        let result;
        let start_point = value[2].start * scene[currentScene].scrollHeight;
        let end_point = value[2].end * scene[currentScene].scrollHeight;
        let animation_point = end_point - start_point;

        if (currentYOffset >= start_point && currentYOffset <= end_point) {
            result = (currentYOffset - start_point) / animation_point * (value[1]-value[0]) + value[0];         
        } else if (currentYOffset < start_point) {
            result = value[0]
        } else if (currentYOffset > end_point) {
            result = value[1]
        }

        return result;
    }

    const playAnimaition = () => {
        let currentYOffset = 0;
        currentYOffset = yOffset - prevScrollHeight;
        scrollRatio = currentYOffset / scene[currentScene].scrollHeight //현재 씬의 비율.
        let value = scene[currentScene].value;
        // console.log(scrollRatio)
        switch (currentScene) {
            case 0:
                // console.log('0 paly');
                break;
            case 1:
                if (scrollRatio <= 0.17) {
                    scene[currentScene].objs.message_A.style.opacity = calculate(value.messageA_opacity_in, currentYOffset);                
                    scene[currentScene].objs.message_A.style.transform = `translateY(${calculate(value.messageA_translateY_in,currentYOffset)}px)`
                } else {
                    scene[currentScene].objs.message_A.style.opacity = calculate(value.messageA_opacity_out, currentYOffset);                
                    scene[currentScene].objs.message_A.style.transform = `translateY(${calculate(value.messageA_translateY_out,currentYOffset)}px)`
                }
                if (scrollRatio <= 0.43) {
                    scene[currentScene].objs.message_B.style.opacity = calculate(value.messageB_opacity_in, currentYOffset);
                    scene[currentScene].objs.message_B.style.transform = `translateY(${calculate(value.messageB_translateY_in,currentYOffset)}px)`
                } else {
                    scene[currentScene].objs.message_B.style.opacity = calculate(value.messageB_opacity_out, currentYOffset);
                    scene[currentScene].objs.message_B.style.transform = `translateY(${calculate(value.messageB_translateY_out,currentYOffset)}px)`
                }
                if (scrollRatio <= 0.69) {
                    scene[currentScene].objs.message_C.style.opacity = calculate(value.messageC_opacity_in, currentYOffset);
                    scene[currentScene].objs.message_C.style.transform = `translateY(${calculate(value.messageC_translateY_in,currentYOffset)}px)`
                } else {
                    scene[currentScene].objs.message_C.style.opacity = calculate(value.messageC_opacity_out, currentYOffset);
                    scene[currentScene].objs.message_C.style.transform = `translateY(${calculate(value.messageC_translateY_out,currentYOffset)}px)`
                }
                break;
            case 2:
                break;
        }
    }

    const update = () => {
        // console.log(yOffset);
        prevScrollHeight = 0;
        error_protect = false;
        for (let i = 0; i < currentScene; i++){
            prevScrollHeight = prevScrollHeight + scene[i].scrollHeight;
        }
        if (yOffset > prevScrollHeight + scene[currentScene].scrollHeight) {
            error_protect =true
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if (yOffset < prevScrollHeight) {
            error_protect = true;
            if (currentScene === 0) return;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        // playAnimaition()
        // console.log(currentScene);

        if (error_protect) return; //playAnimaition()함수가 실행되지 않는다.

        playAnimaition()
    }

    window.addEventListener("scroll", () => {
        yOffset = pageYOffset;
        update();
    })
    window.addEventListener('load', set_Height);
    
    window.addEventListener('resize', set_Height);

})();