const vertexShader = `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main(){
                vUv = uv;
                vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
                gl_Position = projectionMatrix * viewPosition;
                vPosition = position;
            }
            `
        const fragmentShader = `
            varying vec3 vPosition;
            uniform float uHeight;
            varying vec2 vUv;
            uniform float iTime;
            void main(){
                // float gradMix = (vPosition.z+uHeight/2.0)/uHeight;
                // gl_FragColor = vec4(1.0,1.0,0,1.0-gradMix);
                const int zoom = 40;
                const float brightness = 0.975;
                float fScale = 1.25;

                float time = iTime * 1.25;
                vec2 uv = vUv;
                vec2 p  = 1.0 / uv * 2.0;
                // vec2 uv = fragCoord.xy / iResolution.xy;
	            // vec2 p  = (2.0-1.0/uv)/1980.0;
                float ct = (((1.0 + cos(radians(time*5.0))) * 0.5) * 3.0) + 1.1;
                float xBoost = (((1.0 + cos(radians(time*0.2))) * 5.0) * 5.0) + 1.1;
                float yBoost = (((1.0 + cos(radians(time*0.1))) * 10.0) * 5.0) + 1.1;

                fScale = (((1.0 + cos(radians(time*15.5))) * 1.25) * 0.5) + 1.1;

                for(int i=1;i<zoom;i++) {
                    float _i = float(i);
                    vec2 newp=p;
                    newp.x+=0.25/_i*sin(_i*p.y+time*cos(ct)*0.5/20.0+0.005*_i)*fScale+xBoost;		
                    newp.y+=0.25/_i*sin(_i*p.x+time*ct*0.3/40.0+0.03*float(i+15))*fScale+yBoost;
                    p=newp;
                }

                vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));
                col *= brightness;

                float vigAmt = 5.0;
                float vignette = (1.-vigAmt*(uv.y-.5)*(uv.y-.5))*(1.-vigAmt*(uv.x-.5)*(uv.x-.5));
                float extrusion = (col.x + col.y + col.z) / 4.0;
                extrusion *= 1.5;
                extrusion *= vignette;

                gl_FragColor = vec4(col, extrusion);
                // gl_FragColor = vec4(1.0,1.0,0,1.0);
            }
            `