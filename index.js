import * as RR from "react-reality";

const ARKit = {};

makeARGeom = (RRComponent, filterProps) => props => {
  const shapeProps = filterProps(props);
  return (
    <RR.ARNode {...props}>
      <RRComponent {...props} {...shapeProps}>
        <RR.ARMaterials>
          <ARMaterialProperty />
        </RR.ARMaterials>
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

ARBox = makeBasicARGeom(RR.ARBox);
ARCapsule = makeBasicARGeom(RR.ARCapsule);
ARCone = makeBasicARGeom(RR.ARCone);
ARCylinder = makeBasicARGeom(RR.ARCylinder);
ARPlane = makeBasicARGeom(RR.ARPlane);
ARPyramid = makeBasicARGeom(RR.ARPyramid);
ARSphere = makeBasicARGeom(RR.ARSphere);
ARTorus = makeBasicARGeom(RR.ARTorus);
ARTube = makeBasicARGeom(RR.ARTube);
ARShape = makeBasicARGeom(RR.ARShape);
ARText = makeARGeom(RR.ARText, props => {
  if (props.font) {
    return { ...props.font, fontName: props.font.name };
  }
});

/** /
 * TODO
 *
 * Non-basic shapes:
 * ARGroup
 * ARLight
 * ARModel
 * ARSprite
 *
 * Non-shape component:
 * ARKit
 *
 * Libraries:
 * DeviceMotion
 * withProjectedPosition
 * colorUtils
 *
 */

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
  ARShape
};

export default ARKit;
