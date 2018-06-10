import * as RR from "react-reality";
import React from "react";
import * as RRpropTypes from "react-reality/components/propTypes";
makeARGeom = (RRComponent, filterProps) => props => {
  const shapeProps = filterProps && filterProps(props);
  console.log("I am making a box with component", RRComponent);
  return (
    <RR.ARNode {...props}>
      <RRComponent {...props} {...shapeProps}>
        {props.materials &&
          props.materials.map((obj, index) => {
            return (
              <RR.ARMaterial {...obj} key={index} index={index}>
                {["diffuse", "displacement", "specular", "normal"].map(id => {
                  if (obj[id]) {
                    return (
                      <RR.ARMaterialProperty
                        color={obj.color}
                        {...obj[id]}
                        id={id}
                      />
                    );
                  }
                })}
              </RR.ARMaterial>
            );
          })}
      </RRComponent>
    </RR.ARNode>
  );
};
makeBasicARGeom = RRComponent => {
  return makeARGeom(RRComponent, props => {
    if (props.shape) {
      return { ...props.shape };
    }
  });
};
const ARBox = makeBasicARGeom(RR.ARBox);
const ARCapsule = makeBasicARGeom(RR.ARCapsule);
const ARCone = makeBasicARGeom(RR.ARCone);
const ARCylinder = makeBasicARGeom(RR.ARCylinder);
const ARPlane = makeBasicARGeom(RR.ARPlane);
const ARPyramid = makeBasicARGeom(RR.ARPyramid);
const ARSphere = makeBasicARGeom(RR.ARSphere);
const ARTorus = makeBasicARGeom(RR.ARTorus);
const ARTube = makeBasicARGeom(RR.ARTube);
const ARShape = makeBasicARGeom(RR.ARShape);
const ARText = makeARGeom(RR.ARText, props => {
  if (props.font) {
    return { ...props.font, fontName: props.font.name };
  }
});
const ARLight = makeARGeom(RR.ARLight);
//Note that alpha prop is ignored in ARModel because it is seemingly not called in the native code
const ARModel = makeARGeom(RR.ARShape, props => {
  if (props.model)
    return {
      path: props.model.file,
      parentNode: props.model.node,
      scale: props.model.scale
    };
});
//No-opping ARGroup because it doesn't appear to do anything
const ARGroup = props => {
  return null;
};

var ARKit = props => {
  return (
    <RR.ARSessionProvider alignment={getGravity(props.worldAlignment)}>
      <RR.ARMonoView {...props}>
        <RR.ARTrackingProvider
          {...props}
          imageDetection={!!props.imageDetection}
          images={props.imageDetection}
          onUpdateAnchors={anchors => {
            if (props.onPlaneDetected) props.onPlaneDetected(anchors);
            if (props.onPlaneUpdate) props.onPlaneUpdate(anchors);
            if (props.onPlaneUpdated) props.onPlaneUpdated(anchors);
            if (props.onPlaneRemoved) props.onPlaneRemoved(anchors);
            if (props.onAnchorDetected) props.onAnchorDetected(anchors);
            if (props.onAnchorUpdated) props.onAnchorUpdated(anchors);
            if (props.onAnchorRemoved) props.onAnchorRemoved(anchors);
          }}
        >
          <RR.ARPositionProvider
            onPositionChange={({ position, orientation }) => {
              DeviceMotionCB && cb({ position, orientation });
            }}
          >
            {props.children}
          </RR.ARPositionProvider>
        </RR.ARTrackingProvider>
      </RR.ARMonoView>
    </RR.ARSessionProvider>
  );
};
var DeviceMotionCB = null;
const DeviceMotion = {
  start: cb => {
    DeviceMotionCB = cb;
  },
  stop: () => {
    DeviceMotionCB = null;
  }
};
const getGravity = WAEnum => {
  switch (WAEnum) {
    case 0:
      return "gravity";
    case 1:
      return "compass";
    case 2:
      return "camera";
    default:
      return "gravity";
  }
};

ARKit.ARPlaneDetection = {
  Horizontal: "horizontal",
  Vertical: "vertical",
  Both: "both",
  None: null
};

const colorUtils = {
  colorTemperatureToRgb: temperature => {
    const m = global.Math;
    const temp = temperature / 100;
    let r;
    let g;
    let b;

    if (temp <= 66) {
      r = 255;
      g = m.min(m.max(99.4708025861 * m.log(temp) - 161.1195681661, 0), 255);
    } else {
      r = m.min(m.max(329.698727446 * m.pow(temp - 60, -0.1332047592), 0), 255);
      g = m.min(
        m.max(288.1221695283 * m.pow(temp - 60, -0.0755148492), 0),
        255
      );
    }

    if (temp >= 66) {
      b = 255;
    } else if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = m.min(m.max(138.5177312231 * m.log(b) - 305.0447927307, 0), 255);
    }

    return {
      r,
      g,
      b
    };
  },
  whiteBalanceWithTemperature: ({ r, g, b }, temperature) => {
    const temperatureRgb = colorTemperatureToRgb(temperature);
    return {
      r: (r * 255) / temperatureRgb.r,
      g: (g * 255) / temperatureRgb.g,
      b: (b * 255) / temperatureRgb.b
    };
  }
};

/** /
 * TODO
 *
 * Views:
 * ARSprite
 *
 * Libraries:
 * withProjectedPosition
 *
 */

ARKit.Box = ARBox;
ARKit.Capsule = ARCapsule;
ARKit.Cylinder = ARCylinder;
ARKit.Cone = ARCone;
ARKit.Plane = ARPlane;
ARKit.Pyramid = ARPyramid;
ARKit.Sphere = ARSphere;
ARKit.Torus = ARTorus;
ARKit.Tube = ARTube;
ARKit.Shape = ARShape;
ARKit.Text = ARText;
ARKit.Light = ARLight;
ARKit.Model = ARModel;
ARKit.Group = ARGroup;
ARKit.Light = ARLight;
ARKit.LightType = RRpropTypes.lightType;
export {
  ARBox,
  ARCapsule,
  ARCone,
  ARCylinder,
  ARPlane,
  ARPyramid,
  ARSphere,
  ARTorus,
  ARTube,
  ARText,
  ARShape,
  ARLight,
  ARModel,
  ARGroup,
  DeviceMotion,
  colorUtils,
  ARKit
};
