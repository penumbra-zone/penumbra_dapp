import { PositionOpen } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/dex/v1alpha1/dex_pb'
import React from 'react'

export const PositionOpenViewComponent: React.FC<{ view: PositionOpen }> = ({
	view,
}) => {
	console.log(view);
	
	return <div>PositionOpenViewComponent</div>
}
