import Tag from "../entities/Tag.js";
import LikeOp from "./Operators.js"

async function getTags() {
    return await Tag.findAll();
}

async function getTagById(id) {
    return await Tag.findByPk(id);
}

async function createTag(tag) {
    return await Tag.create(tag);
}

async function updateTag(id, tagData) {
    const tag = await Tag.findByPk(id);
    if (!tag) {
        throw new Error("Tag-ul nu a fost găsit.");
    }
    return await tag.update(tagData);
}

async function deleteTag(id) {
    const tag = await Tag.findByPk(id);
    if (!tag) {
        throw new Error("Tag-ul nu a fost găsit.");
    }
    return await tag.destroy();
}

async function getTagWithFilterAndPagination(filter) {

    if (!filter.take)
        filter.take = 10;

    if (!filter.skip)
        filter.skip = 1;

    let whereClause = {};

    if (filter.tagName) {
        whereClause.TagName = { [LikeOp]: `%${filter.tagName}%` };
    }

    return await Tag.findAndCountAll(
        {
            distinct: true,
            where: whereClause,
            limit: parseInt(filter.take),
            offset: parseInt(filter.skip - 1) * parseInt(filter.take)
        });
}

export {getTags, getTagById, createTag, updateTag, deleteTag, getTagWithFilterAndPagination}