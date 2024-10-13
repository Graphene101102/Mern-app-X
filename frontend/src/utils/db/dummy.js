export const POSTS = [
	{
		_id: "1",
		text: "Hello world 😍",
		img: "/posts/post1.png",
		user: {
			username: "Việt",
			profileImg: "/avatars/boy1.png",
			fullName: "Hoàng Việt",
		},
		comments: [
			{
				_id: "1",
				text: "Đẹp đôi quá",
				user: {
					username: "BeaMinh",
					profileImg: "/avatars/girl1.png",
					fullName: "Phương Minh",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
	},
	{
		_id: "2",
		text: "Một ngày thật đẹp nhé 😊",
		user: {
			username: "BeaMinh",
			profileImg: "/avatars/girl1.png",
			fullName: "Phương Minh",
		},
		comments: [
			{
				_id: "1",
				text: "Chúc em ngày mới vui vẻ.",
				user: {
					username: "Graphene",
					profileImg: "/avatars/boy3.png",
					fullName: "Graphene",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
	},
	{
		_id: "3",
		text: "Huế đẹp quá",
		img: "/posts/post2.png",
		user: {
			username: "Graphene",
			profileImg: "/avatars/boy3.png",
			fullName: "Graphene",
		},
		comments: [],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895", "6658s896"],
	},
	{
		_id: "4",
		text: "Khum bít noái gì 🤔",
		img: "/posts/post3.png",
		user: {
			username: "john",
			profileImg: "/avatars/boy2.png",
			fullName: "John",
		},
		comments: [],
		likes: [
			"6658s891",
			"6658s892",
			"6658s893",
			"6658s894",
			"6658s895",
			"6658s896",
			"6658s897",
			"6658s898",
			"6658s899",
		],
	},
];

export const USERS_FOR_RIGHT_PANEL = [
	{
		_id: "1",
		fullName: "Hoàng Việt",
		username: "Việt",
		profileImg: "/avatars/boy1.png",
	},
	{
		_id: "2",
		fullName: "BeaMinh",
		username: "Phương Minh",
		profileImg: "/avatars/girl1.png",
	},
	{
		_id: "3",
		fullName: "John",
		username: "John",
		profileImg: "/avatars/boy2.png",
	},
	{
		_id: "4",
		fullName: "Noname",
		username: "Công chúa bong bóng",
		profileImg: "/avatars/girl2.png",
	},
];