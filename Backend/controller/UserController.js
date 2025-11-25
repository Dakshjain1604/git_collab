const z = require("zod");
const User = require("../model/User");

const profileSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  profile: z
    .object({
      headline: z.string().optional(),
      currentRole: z.string().optional(),
      location: z.string().optional(),
      summary: z.string().optional(),
      skills: z.array(z.string()).optional(),
      socialLinks: z
        .object({
          linkedin: z.string().optional(),
          github: z.string().optional(),
          portfolio: z.string().optional(),
        })
        .partial()
        .optional(),
    })
    .partial()
    .optional(),
});

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
    }

    const updates = parsed.data;

    const profilePayload = updates.profile ?? {};

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          firstname: updates.firstname,
          lastname: updates.lastname,
          email: updates.email,
          profile: {
            ...profilePayload,
            skills: profilePayload.skills ?? [],
            socialLinks: profilePayload.socialLinks ?? {},
          },
        },
      },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (error) {
    next(error);
  }
};

