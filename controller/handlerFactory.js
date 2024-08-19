const catchAsync = require("./../util/AsyncCatch");
const AppError = require("./../util/AppError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docu = await Model.findByIdAndDelete(req.params.id);

    if (!docu) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docu = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!docu) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      date: {
        docu,
      },
    });
  });
