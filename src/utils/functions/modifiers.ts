import { saltRounds } from "../constants";
import { UserModification } from "../../types/User";
import bcrypt from "bcrypt";
import { getPage } from "./getters";
import { Page as Page, Link } from "../../types/Page";
import User from "../../models/User.model";
import uid from "uid";

export const updateUser = async (
	id?: string,
	{ username, email, password, photo, bio, phone }: UserModification = {}
): Promise<{ message: string; code: number }> => {
	const user = await User.findById(id);
	if (!user) {
		return { code: 400, message: "Invalid user id" };
	}
	if (username) {
		user.username = username;
	}
	if (email) {
		user.email = email;
	}
	if (phone) {
		user.phone = phone;
	}
	if (photo) {
		user.photo = photo;
	}
	if (bio) {
		user.bio = bio;
	}
	if (password) {
		const samePassword = await bcrypt.compare(password, user.password);
		if (!samePassword) {
			user.password = await bcrypt.hash(password, saltRounds);
		}
	}
	await user.save();
	return { code: 200, message: "User update successfully" };
};

export const addLink = async (owner: string, link: Link): Promise<Page> => {
	const Page = await getPage(owner);
	if (!Page) throw new Error("invalid page");

	link.id = uid();
	Page.links.push(link);
	Page.markModified("links");
	await Page.save();
	return Page;
};

export const updateLink = async (owner: string, link: Link): Promise<Page> => {
	const Page = await getPage(owner);
	if (!Page) throw new Error("invalid page");

	const linkIndex = Page.links.findIndex(li => li.id === link.id);
	Page.links[linkIndex] = link;
	Page.markModified("links");
	Page.save();
	return Page;
};

export const updatePage = async (
	owner: string,
	theme?: string,
	linkCount?: number
): Promise<Page> => {
	const Page = await getPage(owner);
	if (!Page) throw new Error("invalid page");

	if (theme) Page.theme = theme;
	if (linkCount) Page.linkCount = linkCount;
	Page.save();
	return Page;
};
