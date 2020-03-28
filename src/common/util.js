export default {
	// 数组中索引为index1和index2的元素互换
	swapArray(arr, index1, index2){
		arr[index1] = arr.splice(index2, 1, arr[index1])[0]
	},
	// 将数组元素上移
	moveUp(arr, index){
		if(index !== 0){
			this.swapArray(arr, index, index - 1)
		}
	},
	moveDown(arr, index){
		if(index !== arr.length-1){
			this.swapArray(arr, index, index + 1)
		}
	}
}
