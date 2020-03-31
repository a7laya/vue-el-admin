export default {
	// sku排列组合算法 即笛卡尔积
	cartesianProductOf() {
		return Array.prototype.reduce.call(arguments,function(a, b) {
			var ret = [];
			a.forEach(function(a) {
				b.forEach(function(b) {
					ret.push(a.concat([b]));
				});
			});
			return ret;
		}, [[]]);
		// return arr.reduce(function(a, b) {
		// 	var ret = [];
		// 	a.forEach(function(a) {
		// 		b.forEach(function(b) {
		// 			ret.push(a.concat([b]));
		// 		});
		// 	});
		// 	return ret;
		// }, [[]]);
	},
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
